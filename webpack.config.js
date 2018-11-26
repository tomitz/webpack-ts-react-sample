const path = require("path")    // 絶対パスへの変換
const htmlWebpackPlugin = require("html-webpack-plugin")   // index.htmlをビルド時にdist以下に配置するため
const MODE = process.env.NODE_ENV || "development"
const DEV = MODE === "development"

module.exports = {
    mode: MODE,
    entry: "./src/index.tsx",   // エントリポイント
    devtool: "inline-source-map",
    output: {
        filename: "static/js/bundle.js",    // bundle.jsの出力場所
        path: path.resolve(__dirname, "dist"),  // 出力ディレクトリの絶対パス
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", "tsx"]  // importの時に拡張子を略せる
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: "index.html",
            template: "./public/index.html"  // 同階層のindex.htmlを、ビルド時にdist以下にもデプロイしてくれる
        })
    ],
    devServer: DEV ? {  // 開発環境のみ
        contentBase: path.resolve(__dirname, "dist"),   // content-baseの指定
        watchContentBase: true, // ソースの変更を監視
        open: true, // デフォルトブラウザを自動起動
        openPage: "index.html", // 自動で開くページ
        port: 3000
    } : [], // 開発環境以外ではdevServerに空オブジェクトを渡す
    module: {
        rules: [
            {
                test: /\.tsx?$/,    // tslint-loaderに渡すファイルの正規表現
                enforce: "pre", // ビルド前にLinterを走らせる
                loader: "tslint-loader",    // tslint-loaderを使う
                options: {
                    typeCheck: true,
                    emitErrors: true,    // tslintが出した警告をエラー扱いにする
                    tsConfigFile: "tsconfig.json"
                }
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",    // トランスパイラ
                options: {
                    transpileOnly: true
                }
            },
            {   // CSS Modulesを使う設定
                test: /\.css$/,
                include: path.resolve(__dirname, "src/css"),
                exclude: "/node_modules/",
                use: [{
                    loader: "style-loader",
                    options: {
                        sourceMap: true
                    }
                },{
                    loader: "css-loader",
                    options: {
                        localIdentName: "[sha512:hash:base32]-[name]-[local]",
                        modules: true,
                        sourceMap: true
                    }
                }]
            }
        ]
    }
}