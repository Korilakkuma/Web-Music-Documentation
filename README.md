# Web Music Documentation

[![Node.js CI](https://github.com/Korilakkuma/Web-Music-Documentation/workflows/Node.js%20CI/badge.svg)](https://github.com/Korilakkuma/Web-Music-Documentation/actions?query=workflow%3A%22Node.js+CI%22)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

この Web サイトは, Web ブラウザでオーディオプレイヤーや, シンセサイザー, DAW などの音楽アプリケーションを制作したいという Web ディベロッパーのための有益なドキュメントとなることを目指して制作しています.

## ドキュメント制作に関して

Web はもはやアプリケーションプラットフォームにもなっていますが, この Web サイトはあくまでドキュメントであるということを重視して, **Web 標準技術のみで制作することを原則とします**.

Web 標準技術は以下の 3 つです.

- HTML 5.x 以上
- CSS 3.x 以上
- JavaScript (ES2015 以上)

したがって, HTML テンプレートや, TypeScript, React などサードパーティのライブラリやフレームワークは使いません. これによって, どうしても DRY の原則に従えないケースが多くありますが, サードパーティ製のプロダクトに依存しない, すなわち, **Web 標準技術のみで制作することを原則とすることで, Web フロントエンドの技術的パラダイムに影響されずに, 恒久的にメンテナンス可能なドキュメントを目指します**.

公開サーバーも, GitHub Pages (**静的ホスティングサービス**) にすることで, **特定のサーバー環境やサーバーサイドプログラムに依存しないことを原則とします**.

ただし, 例外的に, 以下の 2 つのケースはサードパーティ製のライブラリを使うことにしています.

- シンタックスハイライト
- 数式

制作開始時点では, シンタックスハイライトは [Prism.js](https://prismjs.com/), 数式は [MathJax](https://www.mathjax.org/) を利用しています.

## ドキュメント制作環境に関して

ローカルサーバーのために, [server.js](https://github.com/Korilakkuma/Web-Music-Documentation/blob/main/server.js) を置いていますが, 例えば, Python の `http.server` でローカルサーバーを起動してもドキュメント制作可能にしています. つまり, どんな方法でもローカルサーバーを起動できれば, ドキュメント制作可能にしています. `webpack-dev-server` や Docker などを使っても構いませんが, **原始的な手法でも制作可能にすることを原則とします** (また, これによってドキュメント制作方針と同様に, サードパーティ製のパッケージへの依存度を下げます).

そのほか, Web アクセシビリティに準拠するため, HTML と CSS には Linter を使っています.

また, 現時点では不要と考えていますが, コントリビューターが増えた場合を考慮して, フォーマッターを使っています.

ドキュメント制作環境に必要なパッケージは, ドキュメント制作に使うものより多少緩くはしていますが, **選定基準として, それがなくてもドキュメントの制作・運用を続けることができることを原則とします** (例えば, Linter やフォーマッターはなくても制作は可能).

## ドキュメントでの音源に関して

### ワンショットオーディオ

[音楽素材/魔王魂](https://maou.audio/) で公開されている[フリー楽器音](https://maou.audio/category/se/se-inst/)を利用させていただいております.


### 楽曲データ

シューベルト 交響曲 第8番 ロ短調 D759 「未完成」 第1楽章 (余談ですが, X JAPAN の「ART OF LIFE」のモチーフになっている曲です) を [CMSL クラシック名曲サウンドライブラリー【ライセンスフリー素材音源 700曲】](http://classical-sound.seesaa.net/article/501024688.html) からダウンロードして利用させていただいております (クロスオリジン制限回避のため, 同一オリジンで公開する必要があるので).
