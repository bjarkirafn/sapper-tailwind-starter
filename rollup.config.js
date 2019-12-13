import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import alias from '@rollup/plugin-alias'
import commonjs from 'rollup-plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import config from 'sapper/config/rollup.js'
import pkg from './package.json'
// import rollup_start_dev from './rollup_start_dev';
import postcss from 'rollup-plugin-postcss'
import sveltePreprocess from 'svelte-preprocess'
import { join } from 'path'


const mode = process.env.NODE_ENV
const dev = mode === 'development'
const legacy = !!process.env.SAPPER_LEGACY_BUILD

const onwarn = (warning, onwarn) =>
  (warning.code === 'CIRCULAR_DEPENDENCY' &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning)
const dedupe = importee =>
  importee === 'svelte' || importee.startsWith('svelte/')

const postcssPlugins = [
  require('postcss-import')(),
  require('tailwindcss')()
  // require("tailwindcss")("./tailwind.config.js"), Uncomment this line to use your own tailwind.config
]

const preprocess = sveltePreprocess({
  transformers: { postcss: { plugins: postcssPlugins } }
})

const shared = [
  alias({
    resolve: [ '.jsx', '.js', '.svelte', '.css' ],
    entries: [
      'static',
      'src/components',
      'src/layout',
      'src/layout/styles'
    ].map(uri => {
      const find = `@${uri.split('/').pop()}`
      const replacement = join(__dirname, uri)
      return { find, replacement }
    })
  }),

  replace({
    'process.browser': false,
    'process.env.NODE_ENV': JSON.stringify(mode)
  }),

  commonjs()
]

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      ...shared,
      svelte({
        dev,
        hydratable: true,
        emitCss: true,
        // preprocess: sveltePreprocess({ postcss: true })
        preprocess
      }),
      resolve({
        browser: true,
        dedupe
      }),

      legacy &&
        babel({
          extensions: [ '.js', '.mjs', '.html', '.svelte' ],
          runtimeHelpers: true,
          exclude: [ 'node_modules/@babel/**' ],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: '> 0.25%, not dead'
              }
            ]
          ],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            [
              '@babel/plugin-transform-runtime',
              {
                useESModules: true
              }
            ]
          ]
        }),

      !dev &&
        terser({
          module: true
        }),
        // dev && rollup_start_dev,

    ],

    onwarn
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      ...shared,
      svelte({
        // preprocess: sveltePreprocess({ postcss: true }),
        generate: 'ssr',
        dev
      }),
       postcss({
        plugins: postcssPlugins,
        extract: 'static/global.css'
      }),
      resolve({
        dedupe
      }),
    //   dev && rollup_start_dev,
    ],
    external: Object.keys(pkg.dependencies).concat(
      require('module').builtinModules ||
        Object.keys(process.binding('natives'))
    ),

    onwarn
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [ ...shared, resolve(), !dev && terser() ],
    onwarn
  }
}
