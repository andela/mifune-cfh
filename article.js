/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    user: {
        name: {
            type: String
        },
        email: {
            type: {
                String
            }
        },
        username: {
            type: {
                String
            }
        },
        password: {
            type: {
                String
            }
        }

    }
});


mongoose.model('Article', ArticleSchema);