/* eslint-disable no-unused-vars */
const fs = require('fs')
const path = require('path')

const { validationResult } = require('express-validator')

const Post = require('../models/post')

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: posts
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.createPost = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed')
    error.statusCode = 422
    throw error
  }

  if (!req.file) {
    const err = new Error('No image provided')
    err.statusCode = 422
    throw err
  }

  const imageUrl = req.file.path
  const title = req.body.title
  const content = req.body.content

  const post = new Post({
    title: title,
    imageUrl: imageUrl,
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
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.getPost = (req, res, next) => {
  const postId = req.params.postId

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post')
        error.statusCode = 404
        throw error
      }
      res.status(200).json({
        message: 'Post fetched successfully!',
        post: post
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed')
    error.statusCode = 422
    throw error
  }

  const title = req.body.title
  const content = req.body.content

  let imageUrl = req.body.image
  if (req.file) {
    imageUrl = req.file.path
  }

  if (!imageUrl) {
    const err = new Error('No file picked')
    err.statusCode = 422
    throw err
  }

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post')
        error.statusCode = 404
        throw error
      }
      post.title = title
      post.imageUrl = imageUrl
      post.content = content

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl)
      }

      return post.save()
    })
    .then(result => {
      res.status(200).json({
        message: 'Post updated successfully!',
        post: result
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post')
        error.statusCode = 404
        throw error
      }
      //check the logged in user 

      clearImage(post.imageUrl)

      return Post.findByIdAndRemove(postId)
    })
    .then(result => {
      console.log('DELETE RESULT: ', result)
      res.status(200).json({
        message: 'Post deleted successfully!'
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath)
  fs.unlink(filePath, err => console.log(err))
}