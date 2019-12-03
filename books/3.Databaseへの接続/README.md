# Database の利用

ログイン認証の処理ができたら、chat のデータをデータベースに格納し、
複数のユーザでデータを共有できるようにしてみましょう。

## Firebase における Database 

Firebase では 以下 2種類のデータベースが用意されています。

- Firebase Realtime Database 
- Firebase Cloud Firestore

Cloud Firestore はクエリの機能などが強化された Database です。

このドキュメントでも Cloud Firestore を利用したデータ操作を紹介していきます。

まずは Firebase Console 上で Cloud Firestore を有効化しておきましょう。

## Database にデータを追加する。

Cloud Firestore の操作には、 `firebase.firestore()` が利用されます。

`firebase.firestore().collection('collection_name').add` を利用して、
データベースにデータを追加することが可能です。

```vue
<script>
  import firebase from '~/service/firebase'

  const db = firebase.firestore();

  export default {
    // ...
    methods: {
      // ...
      submitPost() {
        if (this.form.comment === "") {
          return false
        }
        const date = new Date()
        db.collection('posts').add({
          comment: this.form.comment,
          user: this.user.name,
          date: `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
        })
        this.form.comment = ""
      }
    }
  }
</script>
```

submitPost の処理内で、データの追加を Vuex から Cloud Firestore に書き換えています。

add では任意のコレクション(テーブル) に一つのデータを追加することが可能となっており、
実際に画面を操作して、posts コレクションにデータを追加することが可能です。

追加されたデータは Firestore の管理画面上から確認することができるので、
Firebase Cosole からその動作を確認してみましょう。

## Database からデータを取得する
 
データの追加ができるようになったら、一覧で表示するデータを
Database から取得したデータに置き換えてみましょう。

```vue
<script>
  import firebase from '~/service/firebase'

  const db = firebase.firestore();

  export default {
    data () {
      return {
        form: {
          comment: ""
        },
        posts: null
      }
    },
    computed: {
      user () {
        return this.$store.state.user
      }
    },
    async mounted(){
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          this.$store.dispatch("loginWithUserName", user.displayName)
        }
      })
      this.load()
    },
    methods: {
      async load(){
        const snapshot = await db.collection('posts')
          .orderBy('date', 'desc')
          .get()
        console.log(snapshot)
        if(snapshot.empty){
          this.posts = []
        }else{
          this.posts = snapshot.docs.map((doc)=>{
            return doc.data()
          })
        }
      },
      async login () {
        const provider = new firebase.auth.GithubAuthProvider()
        const result = await firebase.auth().signInWithPopup(provider)
        // var token = result.credential.accessToken
        var user = result.user
        this.$store.dispatch("loginWithUserName", user.displayName)
      },
      submitPost() {
        // ...
        db.collection('posts').add({
          // ...
        })
        this.load()
        this.form.comment = ""
      }
    }
  }
</script>
```

変更点は 以下の 3つです。

- posts を vuex から data に移動
- methods に load 関数を追加
- mounted と submitPost で load をコール

load 関数では、get を利用して、データの取得を行うことができます。

```js
const snapshot = await db.collection('posts')
  .orderBy('date', 'desc')
  .get()
console.log(snapshot)
if(snapshot.empty){
  this.posts = []
}else{
  this.posts = snapshot.docs.map((doc)=>{
    return doc.data()
  })
}
```

取得したオブジェクトは QuerySnapshot オブジェクトと呼ばれるもので、
`docs` の中から配列形式でデータを取得することが可能です。

配列内のデータは、QueryDocumentSnapshot オブジェクトと呼ばれるもので、
data 関数をコールしてそれぞれのデータを取得することができます。

結果オブジェクトに関する詳しい API は以下の資料から確認可能です。

https://googleapis.dev/nodejs/firestore/latest/index.html
