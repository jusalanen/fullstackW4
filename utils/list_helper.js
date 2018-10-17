const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const arr = [].concat(blogs)
  let likes = 0
  arr.forEach(blog => {
    likes += blog.likes
  })
  return likes
}

const favoriteBlog = (blogs) => {
  let fav = null
  let max = 0
  const arr = [].concat(blogs)
  arr.forEach(blog => {
    if(blog.likes >= max) {
      max = blog.likes
      fav = blog
    }
  })
  return(
    {
      title: fav.title,
      author: fav.author,
      likes: fav.likes
    }
  )
}

const mostBlogs = (blogs) => {
  const authArr = []
  const blogsArr = [].concat(blogs)
  blogsArr.forEach(blog => {
    if( !authArr.includes(blog.author) ) {
      authArr.push({ author: blog.author, blogs: 0 })
    }
  })
  authArr.forEach(auth => {
    blogsArr.forEach( blog => {
      if (auth.author === blog.author) {
        auth.blogs += 1
      }
    })
  })
  const maxBlogs = { author: '', blogs: 0 }
  authArr.forEach(auth => {
    if (auth.blogs > maxBlogs.blogs) {
      maxBlogs.author = auth.author
      maxBlogs.blogs = auth.blogs
    }
  })
  return maxBlogs
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}