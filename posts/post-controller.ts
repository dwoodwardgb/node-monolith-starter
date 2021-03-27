import {Router} from 'express'
import * as posts from './post-service'
import * as views from './post-views'

const router = Router()

router.post('', async (req, res) => {
  await posts.upsert(req.db, req.body)
  res.send(views.newForm({}))
})

export default router
