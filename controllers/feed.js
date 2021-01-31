/* eslint-disable no-unused-vars */

const { validationResult } = require('express-validator')

const Post = require('../models/post')

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{
      _id: 1,
      title: 'First post',
      content: 'First post here!',
      imageUrl: 'images/book.jpg',
      creator: {
        name: 'sakshi'
      },
      createdAt: new Date()
    }]
  })
}

exports.createPost = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation Failed',
      errors: errors.array()
    })
  }
  const title = req.body.title
  const content = req.body.content

  const post = new Post({
    title: title,
    imageUrl: 'images/book.png',
    content: content,
    creator: { name: 'sakshi' }
  })

  post.save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'Post created successfully',
        post: result
      })
    })
    .catch(err => console.log(err))
}