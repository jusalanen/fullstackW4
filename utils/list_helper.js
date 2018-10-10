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

module.exports = {
  dummy,
  totalLikes
}