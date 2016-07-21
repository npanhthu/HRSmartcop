"use strict";

module.exports = {

    entry: {
        app: ["./Client/app/main.js"]
    },

    output:{
        path:__dirname,
        filename:'bundle.js'
    },

    module: {
        loaders: [{
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    optional: ['runtime'],
                    stage: 0
                }
            },
            {
                test: /\.less$/,
                loader: "style-loader!css-loader!less-loader"
            },

            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    }
}