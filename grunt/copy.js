module.exports = {
  vault: {
    files: [
      {
        expand: true,
        src: ['secrets/**/*', 'secrets/.ssh/*', '!secrets/vault-pass.txt', '!secrets/.generated/*', '!secrets/.generated/**/*'],
        dest: 'vault/'
      }
    ]
  }
}
