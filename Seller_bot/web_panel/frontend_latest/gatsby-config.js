module.exports = {
  flags: {
    DEV_SSR: true
  },
  siteMetadata: {
    title: `Redcat`,
    siteUrl: `https://rcat.io`
  },
  plugins: ["gatsby-plugin-styled-components", "gatsby-plugin-image", "gatsby-plugin-sitemap","gatsby-plugin-material-ui","gatsby-plugin-emotion", {
    resolve: 'gatsby-plugin-manifest',
    options: {
      "icon": "src/images/logo.png",
    }
  }, "gatsby-plugin-sharp", "gatsby-transformer-sharp", {
    resolve: 'gatsby-source-filesystem',
    options: {
      "name": "images",
      "path": "./src/images/"
    },
    __key: "images"
  }]
};