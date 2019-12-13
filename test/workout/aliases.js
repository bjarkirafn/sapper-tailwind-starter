import path from 'path'

const aliases = {
  resolve: [ '.jsx', '.js', '.svelte' ],
  entries: [ 'static', 'src/components', 'src/layout/styles' ].map(i => {
    const find = `@${i.split('/').pop()}`
    const replacement = path.join(__dirname, i)

    return { find, replacement }
  })
}

console.log(aliases)
