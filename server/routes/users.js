import express from 'express';

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, _next) => {
  res.send('<h1 style="color:red">LISTA DE AMIGOS</h1>');
});

export default router;