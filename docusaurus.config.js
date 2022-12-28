const visit = require("unist-util-visit")
const ssrTemplate = require("./src/internals/ssr.template")
const consts = require("./src/config/consts")
const customFields = require("./src/config/customFields")
const math = require("remark-math")
const katex = require("rehype-katex")

function variable() {
  const RE_VAR = /{@([\w-_]+)@}/g
  const getVariable = (full, partial) =>
    partial ? customFields[partial] : full

  function textVisitor(node) {
    node.value = node.value.replace(RE_VAR, getVariable)
  }

  function linkVisitor(node) {
    node.url = node.url.replace(RE_VAR, getVariable)

    if (node.title) {
      node.title = node.title.replace(RE_VAR, getVariable)
    }
  }

  function transformer(ast) {
    visit(ast, "text", textVisitor)
    visit(ast, "code", textVisitor)
    visit(ast, "link", linkVisitor)
  }

  return transformer
}

const config = {
  title: "QuestDB: the database for time series",
  tagline: "QuestDB is the fastest open source time series database",
  url: `https://${consts.domain}`,
  baseUrl: "/",
  baseUrlIssueBanner: false,
  favicon: "/img/favicon.png",
  organizationName: "QuestDB",
  projectName: "questdb",
  customFields: customFields,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  plugins: [
    require.resolve("./plugins/fetch-latest-release/index"),
    require.resolve("./plugins/fetch-repo/index"),
    require.resolve("./plugins/remote-repo-example/index"),
    require.resolve("./plugins/fetch-contributors-count/index"),
    require.resolve("./plugins/webpack-ts/index"),
    require.resolve("./plugins/optimize/index"),
    require.resolve("./plugins/manifest/index"),
    require.resolve("./plugins/delay-code-block-appearance"),
    [
      "@docusaurus/plugin-pwa",
      {
        pwaHead: [
          {
            tagName: "link",
            rel: "manifest",
            href: "/manifest.webmanifest",
          },
          {
            tagName: "meta",
            name: "theme-color",
            content: "#d14671",
          },
          {
            tagName: "meta",
            name: "apple-mobile-web-app-capable",
            content: "yes",
          },
          {
            tagName: "meta",
            name: "apple-mobile-web-app-status-bar-style",
            content: "#21222c",
          },
        ],
      },
    ],
    [
      require.resolve("./plugins/blog"),
      {
        remarkPlugins: [variable, math],
        rehypePlugins: [katex],
        feedOptions: {
          type: "all",
          copyright: customFields.copyright,
        },
        showReadingTime: true,
        postsPerPage: 1000,
        blogPostComponent: require.resolve(
          "./src/theme/BlogPostPage/index.tsx",
        ),
        blogTagsPostsComponent: require.resolve(
          "./src/theme/BlogListPage/index.tsx",
        ),
      },
    ],
    ...[
      process.env.POSTHOG_API_KEY
        ? require.resolve("posthog-docusaurus/src/index.js")
        : null,
    ],
  ].filter(Boolean),
  themeConfig: {
    posthog: {
      apiKey: process.env.POSTHOG_API_KEY,
    },
    announcementBar: {
      id: "github-star",
    },
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    image: "/img/og.gif",
    gtag: {
      trackingID: "GTM-PVR7M2G",
      anonymizeIP: true,
    },
    prism: {
      defaultLanguage: "questdb-sql",
      additionalLanguages: [
        "rust",
        "csharp",
        "julia",
        "cpp",
        "java",
        "ebnf",
        "ini",
        "toml",
        "ruby",
        "php",
      ],
      theme: require("./src/internals/prism-github"),
      darkTheme: require("./src/internals/prism-dracula"),
    },
    algolia: {
      appId: "QL9L2YL7AQ",
      apiKey: "2f67aeacbe73ad08a49efb9214ea27f3",
      indexName: "questdb",
    },
    navbar: {
      title: " ",
      logo: {
        alt: "QuestDB",
        src: "/img/navbar/questdb.svg",
      },
      items: [
        {
          label: "Product",
          position: "left",
          items: [
            {
              label: "QuestDB Cloud",
              to: "/cloud/",
            },
            {
              label: "QuestDB Enterprise",
              to: "/enterprise/",
            },
            {
              label: "Use Cases",
              to: "/use-cases/",
            },
            {
              label: "Customers",
              to: "/customers/",
            },
            {
              label: "Roadmap",
              href: `https://github.com/orgs/questdb/projects/1/views/5`,
            },
          ],
        },
        {
          label: "Learn",
          position: "left",
          items: [
            {
              label: "Blog",
              to: "/blog/",
              activeBaseRegex: "/blog/?$",
            },
            {
              label: "Tutorials",
              to: "/blog/tags/tutorial/",
              activeBaseRegex: "/blog/tags/tutorial/?$",
            },
            {
              label: "QuestDB Swag",
              to: "/community/",
            },
            {
              label: "Slack Community",
              to: customFields.slackUrl,
            },
          ],
        },
        {
          label: "Docs",
          to: "/docs/",
          position: "left",
        },
        {
          label: "Pricing",
          to: "/pricing/",
          position: "left",
        },
        {
          label: "Star us",
          href: "https://github.com/questdb/questdb",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository",
        },
      ],
    },
    footer: {
      links: [
        {
          title: "Product",
          items: [
            {
              label: "Cloud",
              to: "/cloud/",
            },
            {
              label: "Enterprise",
              to: "/enterprise/",
            },
            {
              label: "Pricing",
              to: "/pricing/",
            },
            {
              label: "Use Cases",
              to: "/use-cases/",
            },
            {
              label: "Customers",
              to: "/customers/",
            },
            {
              label: "Roadmap",
              href: "https://github.com/orgs/questdb/projects/1/views/5",
            },
          ],
        },
        {
          title: "Developers",
          items: [
            {
              label: "Docs",
              to: "/docs/",
            },
            {
              label: "Tutorials",
              to: "/blog/tags/tutorial/",
            },
            {
              label: "Blog",
              to: "/blog/",
            },
            {
              label: "Discussions",
              to: customFields.linenUrl,
            },
            {
              label: "Join Slack",
              to: customFields.slackUrl,
            },
            {
              label: "Swag",
              to: "/community/",
            },
          ],
        },
        {
          title: "Company",
          items: [
            {
              label: "About us",
              to: "/about-us/",
            },
            {
              label: "Careers",
              to: "/careers/",
            },
          ],
        },
        {
          title: "Social",
          items: [
            {
              label: "Twitter",
              href: customFields.twitterUrl,
            },
            {
              label: "GitHub",
              href: customFields.githubUrl,
            },
            {
              label: "StackOverflow",
              to: customFields.stackoverflowUrl,
            },
            {
              label: "Linkedin",
              href: customFields.linkedInUrl,
            },
            {
              label: "YouTube",
              to: customFields.videosUrl,
            },
            {
              label: "Reddit",
              href: customFields.redditUrl,
            },
          ],
        },
      ],
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        // blog is enabled through a custom plugin
        // ./plugins/blog/index.js
        blog: false,
        docs: {
          remarkPlugins: [variable, math],
          rehypePlugins: [katex],
          sidebarPath: require.resolve("./sidebars.js"),
        },

        sitemap: {
          changefreq: "daily",
          priority: 0.7,
          trailingSlash: true,
        },
        theme: {
          customCss: [
            require.resolve("./src/css/katex.min.css"),
            require.resolve("./src/css/_global.css"),
          ],
        },
      },
    ],
  ],
}

module.exports = {
  ...config,
  ssrTemplate: ssrTemplate(config),
}
