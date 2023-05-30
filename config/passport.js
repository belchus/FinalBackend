const LocalStrategy = require('passport-local').Strategy
const bcript = require('bcryptjs')

function initialize(passport, getUserByEmail, getUserById) {
  const auth = async (email, password, done) => {
    const user = await getUserByEmail(email)
    if (user.error) {
      return done(null, false, { message: "no existe usuario con ese mail en la base de datos." })
    }
    try {
      if (await bcript.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: "la contraseña ingresada es incorrecta" })
      }
    } catch (error) {
      return done(error)
    }
  }
  passport.use(new LocalStrategy({ usernameField: 'email' }, auth))
  passport.serializeUser((user, done) => { done(null, user.id) })
  passport.deserializeUser(async (id, done) => {
    return done(null, await getUserById(id))
  })
}

module.exports = initialize