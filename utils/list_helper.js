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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}