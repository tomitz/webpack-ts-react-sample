const path = require('path');   // 絶対パスへの変換
const htmlWebpackPlugin = require('html-webpack-plugin');   // index.htmlをビルド時にdis以下に配置するため

module.exports = {
    mode: 'production',  // 本番環境
    entry: './src/index.tsx',   // エントリポイント
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
    module: {
        rules: [
            {
                test: /\.tsx?$/,    // tslint-loaderに渡すファイルの正規表現
                exclude: '/node_modules/',  // tslint-loaderに渡さないファイル
                enforce: 'pre', // ビルド前にLinterを走らせる
                loader: 'tslint-loader',    // tslint-loaderを使う
                options: {
                    typeCheck: true,
                    emitErrors: true,    // tslintが出した警告をエラー扱いにする
                    tsConfigFile: 'tsconfig.prod.json'
                }
            },
            {
                test: /\.tsx?$/,
                exclude: '/node_modules/',
                loader: 'ts-loader',    // トランスパイラ
                options: {
                    configFile: 'tsconfig.prod.json'    // 開発環境用のコンパイル設定ファイル
                }
            },
            {   // CSS Modulesを使う設定
                test: /\.css$/,
                include: path.resolve(__dirname, 'src/css'),
                exclude: '/node_modules/',
                use: [{
                    loader: 'style-loader'
                },{
                    loader: 'css-loader',
                    options: {
                        localIdentName: '[sha512:hash:base32]-[name]-[local]',
                        modules: true
                    }
                }]
            }
        ]
    }
};