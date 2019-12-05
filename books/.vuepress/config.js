module.exports = {
    title: 'Nuxt.js と Firebase を用いた SPA ',
    description: 'Vue.js 製のフロント制作フレームワーク Nuxt.js と Firebase を使って SPA を構築する際の実践的手法を紹介します。',
    head: [
        ['script', { src: "https://static.codepen.io/assets/embed/ei.js"}]
    ],
    locales: {
        '/': {
            lang: 'ja',
        },
    },
    markdown: {
        anchor: {
            level: [1,2,3],
            slugify: (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-')),
            permalink: true,
            permalinkBefore: true,
            permalinkSymbol: '#'
        },
        config: md => {
            md.use(require('markdown-it-playground'))
        },
        linkify: true
    },
    themeConfig: {
        nav: [
            { text: 'Lec Café', link: 'https://leccafe.connpass.com/' },
        ],
        sidebar: [
            '/1.環境構築/',
            '/2.firebaseと認証/',
            '/3.Databaseへの接続/',
            '/実践演習/',
          {
            title: '補足資料',
            children: [
            ]
          },
        ],
        repo: 'lec-cafe/books_nuxtjs_firebase',
        repoLabel: 'Github',
        docsDir: 'books',
        editLinks: true,
        editLinkText: 'ページに不明点や誤字等があれば、Github にて修正を提案してください！'
    }
}
