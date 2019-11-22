module.exports = {
  'transpileDependencies': [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        secure: false
      }
    }
  }
}
