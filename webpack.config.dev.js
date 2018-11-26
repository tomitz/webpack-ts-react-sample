const path = require('path');   // 絶対パスへの変換
const htmlWebpackPlugin = require('html-webpack-plugin');   // index.htmlをビルド時にdis以下に配置するため

module.exports = {
    mode: 'development',  // 開発環境
    entry: './src/index.tsx',   // エントリポイント
    devtool: 'source-map',
    output: {
        filename: 'static/js/bundle.js',    // bundle.jsの出力場所
        path: path.resolve(__dirname, 'dist'),  // 出力ディレクトリの絶対パス
    },
    resolve: {
        extensions: ['.js', ".jsx", ".ts", "tsx"]  // importの時に拡張子を略せる
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: "index.html",
            template: "./public/index.html"  // 同階層のindex.htmlを、ビルド時にdist以下にもデプロイしてくれる
        })
    ],
    devServer:  {
        contentBase: path.resolve(__dirname, 'dist'),   // content-baseの指定
        watchContentBase: true, // ソースの変更を監視
        open: true, // デフォルトブラウザを自動起動
        openPage: "index.html", // 自動で開くページ
        port: 3000
    },
    module: {
        rules: [
            {
                enforce: 'pre', // ビルド前にLinterを走らせる
                loader: 'tslint-loader',    // tslint-loaderを使う
                test: /\.tsx?$/,    // tslint-loaderに渡すファイルの正規表現
                exclude: '/node_modules/',  // tslint-loaderに渡さないファイル
                options: {
                    emitErrors: true    // tslintが出した警告をエラー扱いにする
                }
            },
            {
                loader: 'ts-loader',    // トランスパイラ
                test: /\.tsx?$/,
                exclude: '/node_modules/',
                options: {
                    configFile: 'tsconfig.dev.json'    // 開発環境用のコンパイル設定ファイル
                }
            },
            {
                loaders: ['style-loader', 'css-loader?modules'],    // CSS Modulesを使う設定 ?modulesがオプション
                test: /\.css$/,
                exclude: '/node_modules/'
            }
        ]
    }
};