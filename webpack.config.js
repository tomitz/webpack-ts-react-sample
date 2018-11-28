const path = require('path') // 絶対パスへの変換
const htmlWebpackPlugin = require('html-webpack-plugin') // index.htmlをビルド時にdist以下に配置するため
const MODE = process.env.NODE_ENV || 'development'
const DEV = MODE === 'development'

module.exports = {
    mode: MODE,
    entry: {
        main: path.resolve(__dirname, 'src/index.tsx')
    },
    devtool: 'inline-source-map',
    devServer: DEV
        ? {
              // 開発環境のみ
              contentBase: path.resolve(__dirname, 'dist'), // content-baseの指定
              watchContentBase: true, // ソースの変更を監視
              open: true, // デフォルトブラウザを自動起動
              openPage: 'index.html', // 自動で開くページ
              port: 3000
          }
        : [], // 開発環境以外ではdevServerに空オブジェクトを渡す
    output: {
        filename: '[name].js', // bundle.jsの出力場所
        path: path.resolve(__dirname, 'dist') // 出力ディレクトリの絶対パス
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'] // importの時に拡張子を略せる
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html' // 同階層のindex.htmlを、ビルド時にdist以下にもデプロイしてくれる
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: { sourceMap: true }
                    },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    }
                ]
            },
            {
                // normalize.css
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            }
        ]
    }
}
