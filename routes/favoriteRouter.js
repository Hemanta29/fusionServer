const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;

const Favorite = require('../models/favorite');
const Dishes = require('../models/dishes');
var authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Favorite.find({})
            .populate(['user', 'dishes'])
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
        Favorite.find({ user: req.user._id }).exec()
            .then(async (favorites) => {
                // favorites = JSON.parse(JSON.stringify(favorites));
                console.log(req.body);
                if (req.body && req.body.length == 0) {
                    err = new Error('DishId list can not be empty');
                    err.status = 201;
                    return next(err);
                } else {
                    if (favorites.length == 0) {
                        Favorite.create({
                            user: req.user._id,
                            dishes: req.body
                        }).then((fav) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(fav);
                        }, (err) => next(err));
                    } else {
                        favor = JSON.parse(JSON.stringify(favorites));
                        var resJSON;
                        await Promise.all(
                            req.body.map(async element => {
                                if (!favor[0].dishes.includes(element)) {
                                    favorites[0].dishes.push(element);
                                    var fav = await favorites[0].save();
                                    resJSON = fav;
                                }
                            }))
                        if (!resJSON) {
                            resJSON = {
                                message: "Dishes are already in the favorite list"
                            }
                        }
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(resJSON);
                    }
                }


            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {
        Favorite.find({ user: req.user._id }).exec()
            .then(async (favorites) => {
                // console.log(req.body);
                if (req.body && req.body.length == 0) {
                    err = new Error('DishId list can not be empty');
                    err.status = 201;
                    return next(err);
                } else {
                    if (favorites.length == 0) {
                        err = new Error('No favorite dish present for you!');
                        err.status = 201;
                        return next(err);
                    } else {
                        favor = JSON.parse(JSON.stringify(favorites));
                        // console.log(favor);
                        var resJSON;
                        await Promise.all(
                            req.body.map(async element => {
                                // console.log(element);
                                // console.log(favor[0].dishes.includes(element));
                                if (favor[0].dishes.includes(element)) {
                                    // console.log(element);
                                    favorites[0].dishes.remove(element);
                                    var fav = await favorites[0].save();
                                    resJSON = fav;
                                    // fav = JSON.parse(JSON.stringify(fav))
                                    // console.log(fav);
                                }
                            }))
                        if (!resJSON) {
                            resJSON = {
                                message: "Dishes are already removed from favorites"
                            }
                        }
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(resJSON);
                    }
                }


            }, (err) => next(err))
            .catch((err) => next(err));
    })


favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId).exec()
            .then((dish) => {
                if (dish != null) {
                    Favorite.find({ user: req.user._id }).exec()
                        .then((favorites) => {
                            // favorites = JSON.parse(JSON.stringify(favorites));
                            if (favorites.length == 0) {
                                Favorite.create({
                                    user: req.user._id,
                                    dishes: [req.params.dishId]
                                }).then((fav) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(fav);
                                }, (err) => next(err));
                            } else {
                                // console.log(req.params.dishId);
                                // console.log(favorites[0].dishes);
                                // console.log(req.params.dishId);
                                favor = JSON.parse(JSON.stringify(favorites))
                                // console.log(fav[0].dishes.includes(req.params.dishId));
                                if (!favor[0].dishes.includes(req.params.dishId)) {
                                    favorites[0].dishes.push(req.params.dishId);
                                    favorites[0].save().then((fav) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(fav);
                                    })
                                }
                                else {
                                    err = new Error('Dish ' + req.params.dishId + ' is already in the favorites');
                                    err.status = 201;
                                    return next(err);
                                }
                            }

                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            })
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId).exec()
            .then((dish) => {
                if (dish != null) {
                    Favorite.find({ user: req.user._id }).exec()
                        .then((favorites) => {
                            // favorites = JSON.parse(JSON.stringify(favorites));
                            if (favorites.length == 0) {
                                err = new Error('No favorite dish present for you!');
                                err.status = 201;
                                return next(err);
                            } else {
                                // console.log(req.params.dishId);
                                // console.log(favorites[0].dishes);
                                // console.log(req.params.dishId);
                                favor = JSON.parse(JSON.stringify(favorites))
                                // console.log(fav[0].dishes.includes(req.params.dishId));
                                if (favor[0].dishes.includes(req.params.dishId)) {
                                    favorites[0].dishes.remove(req.params.dishId);
                                    favorites[0].save().then((fav) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(fav);
                                    })
                                }
                                else {
                                    err = new Error('Dish ' + req.params.dishId + ' is already removed from favorites');
                                    err.status = 201;
                                    return next(err);
                                }
                            }

                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            })
    })




module.exports = favoriteRouter;