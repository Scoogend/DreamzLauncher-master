const fs = require('fs-extra')
const path = require('path')
const toml = require('toml')
const merge = require('lodash.merge')

let lang

exports.loadLanguage = function(id) {
    try {
        const languageFile = fs.readFileSync(path.join(__dirname, '..', 'lang', `${id}.toml`), 'utf-8')
        lang = merge(lang || {}, toml.parse(languageFile) || {})
    } catch (err) {
        console.error(`Erreur lors du chargement du fichier de langue ${id}:`, err)
    }
}

exports.query = function(id, placeHolders) {
    let query = id.split('.')
    let res = lang
    for (let q of query) {
        if (res[q] === undefined) {
            console.error(`La clé "${id}" est introuvable dans le fichier de langue.`)
            return '' // Retourner une chaîne vide si la clé n'existe pas
        }
        res = res[q]
    }
    let text = res === lang ? '' : res
    if (placeHolders) {
        Object.entries(placeHolders).forEach(([key, value]) => {
            text = text.replace(`{${key}}`, value)
        })
    }
    return text
}

exports.queryJS = function(id, placeHolders) {
    return exports.query(`js.${id}`, placeHolders)
}

exports.queryEJS = function(id, placeHolders) {
    return exports.query(`ejs.${id}`, placeHolders)
}

exports.setupLanguage = function() {
    // Charger les fichiers de langue
    exports.loadLanguage('en_US')
    // Décommentez cette ligne lorsque les traductions seront prêtes
    //exports.loadLanguage('xx_XX')

    // Charger le fichier de langue personnalisé pour le customizer du launcher
    exports.loadLanguage('_custom')
}