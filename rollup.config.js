import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import alias from '@rollup/plugin-alias'
import commonjs from 'rollup-plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import config from 'sapper/config/rollup.js'
import pkg from './package.json'
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

const sharedPlugins = [
  alias({
    resolve: [ '.jsx', '.js', '.svelte' ],
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

const sharedSvelte = {
  preprocess: sveltePreprocess({ postcss: true })
}

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      ...sharedPlugins,
      svelte({
        ...sharedSvelte,
        dev,
        hydratable: true,
        emitCss: true
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
        })
    ],

    onwarn
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      ...sharedPlugins,
      svelte({
        ...sharedSvelte,
        generate: 'ssr',
        dev
      }),
      resolve({
        dedupe
      })
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
    plugins: [ ...sharedPlugins, resolve(), !dev && terser() ],
    onwarn
  }
}
