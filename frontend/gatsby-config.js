module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "Frontend",
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-antd",
    {
        resolve: "gatsby-source-filesystem",
        options: {
            name: "images",
            path: "./src/images/",
        },
        __key: "images",
    }
  ],
};
