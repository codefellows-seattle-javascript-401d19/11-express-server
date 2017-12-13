'use strict';

const { Router } = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

const UserAccount = require('../model/userAccount');
const logger = require('../lib/logger');

const userAccountRouter = module.exports = new Router();

userAccountRouter.post('/api/userAccounts', jsonParser, (request, response, next) => {
  if (!request.body.name || !request.body.description) {
    return next(httpErrors(400, 'name and description are required'));
  }

  return new UserAccount(request.body).save()
    .then(userAccount => response.json(userAccount))
    .catch(next);
});

userAccountRouter.get('/api/userAccounts/:id', (request, response, next) => {
  UserAccount.findById(request.params.id)
    .then(userAccount => {
      if (!userAccount) {
        throw httpErrors(404, 'user not found');
      }
      logger.log('info', 'GET - returning a 200 status code');
      logger.log('info', userAccount);

      return response.json(userAccount);
    })
    .catch(next);
});

userAccountRouter.get('/api/userAccounts', (request, response) => {
  logger.log('info', 'GET - processing a request for all userAccounts');

  UserAccount.find({})
    .then(userAccounts => {
      logger.log('info', 'GET - returning a 200 status code');
      logger.log('info', userAccounts);

      return response.json(userAccounts);
    })
    .catch(error => {
      if (error.message.indexOf('Cast to ObjectId failed') > -1) {
        logger.log('info', 'GET - returning a 404 status code. Could not parse id');
        return response.sendStatus(404);
      }
      logger.log('error', 'GET - returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

userAccountRouter.delete('/api/userAccounts/:id', (request, response) => {
  logger.log('info', 'DELETE - processing a request for userAccounts');

  UserAccount.findOneAndRemove(request.params.id)
    .then(userAccount => {
      if (!userAccount) {
        logger.log('info', 'DELETE - returning a 404 status code');
        return response.sendStatus(404);
      }
      logger.log('info', 'DELETE - returning a 204 status code');
      logger.log('info', userAccount);

      return response.sendStatus(204);
    })
    .catch(error => {
      if (error.message.indexOf('Cast to ObjectId failed') > -1) {
        logger.log('info', 'DELETE - returning a 404 status code. Could not parse id');
        return response.sendStatus(404);
      }
      logger.log('error', 'DELETE - returning a 500 code');
      logger.log('error', error);
      return response.sendStatus(500);
    });
});

userAccountRouter.delete('/api/userAccounts', (request, response) => {
  logger.log('info', 'DELETE - returning a 400 status code. No id provided');
  return response.sendStatus(400);
});
