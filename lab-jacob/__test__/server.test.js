'use strict';

process.env.PORT =  7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const starTrekEpisodes = require('../model/star-trek-episodes');
const server = require('../lib/server');

const apiURL = `http://localhost:${process.env.PORT}/api/star-trek-episodes`;
beforeEach(server.start);
afterEach(server.stop);
afterEach(() => starTrekEpisodes.remove({}));

const starTrekMockEpisode = () => {
  return new starTrekEpisodes({
    title : `Encounter at Farpoint`,
    episode : 1,
    content : faker.lorem.words(50),
  }).save();
};


describe('/api/star-trek-episodes', () => {

  describe('POST /api/star-trek-episodes', () => {
    starTrekMockEpisode();
    test('Should respond with a Episode and 200 status code if there is no error', () => {
      let episodeToPost = {
        title : `Encounter at Farpoint`,
        episode : 1,
        content : faker.lorem.words(50),
      };
      return superagent.post(`${apiURL}`)
        .send(episodeToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.title).toEqual(`Encounter at Farpoint`);
          expect(response.body.episode).toEqual(1);
          expect(response.body.content).toEqual(episodeToPost.content);
        });
    });
 
    test('should respond with a 400 code if we send an incomplete Episode', () => {
      
      let episodeToPost = {
        content : faker.lorem.words(100),
      };
      return superagent.post(`${apiURL}`)
        .send(episodeToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

  });

  describe('GET /api/star-trek-episodes', () => {
    test('Should respond with 200 status code if there is no error', () => {
      let episodeToTest = null;

      starTrekMockEpisode()
        .then(Episode => {
          episodeToTest = Episode;
          return superagent.get(`${apiURL}/${Episode._id}`);
        })
        .then(response => {
          console.log(response.body);
          expect(response.status).toEqual(200);

          expect(response.body._id).toEqual(episodeToTest._id.toString());
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.title).toEqual(episodeToTest.title);
          expect(response.body.content).toEqual(episodeToTest.content);
        });
    });
  
    test('should respond with 404 status code if the ID is incorrect', () => {
      return superagent.get(`${apiURL}/WRONG_ID`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/star-trek-episodes', () =>{
    
    test('should response with 200 code if there is no error', () => {
      let episodeToTest = null;
      
      starTrekMockEpisode()
        .then(Episode => {
          episodeToTest = Episode;
          return superagent.get(`${apiURL}/${Episode._id}`);
        })
        .then(response => {
          console.log(response.body);
          expect(response.status).toEqual(200);
      
          expect(response.body._id).toEqual(null);
          expect(response.body.timestamp).toBeFalsey();
      
          expect(response.body.title).toEqual(null);
          expect(response.body.content).toEqual(null);
        });
    });
  });
    



});