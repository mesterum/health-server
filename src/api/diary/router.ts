import { initServer } from "@ts-rest/express";
import { auth } from '../auth/router.js';
import { Diary, DiaryContract } from "../../contract/diary.js";
import { DiaryModel, IntakeModel } from "./dbmodel.js";


const s = initServer();

export const diaryRouter = s.router(DiaryContract, {
  listItems: {
    middleware: [auth],
    handler: async ({ params: { date }, req }) => {
      const diary = (await DiaryModel.findOne({ user: req.authUser, date }) ?? new DiaryModel({ user: req.authUser, date })) as Diary
      return {
        status: 200,
        body: diary
      };
    }
  },
  addItem: {
    middleware: [auth],
    handler: async ({ params: { date }, body, req }) => {
      const diary = await DiaryModel.findOne({ user: req.authUser, date }) ?? new DiaryModel({ user: req.authUser, date });
      // mongoose.set('debug', true)
      const items = (Array.isArray(body) ? body : [body]).map(item => new IntakeModel(item))
      await Promise.all(items.map(item => item.validate()))
      diary.items.push(...items);
      // await diary.save();
      diary.totalCalories += items.reduce((total, item) => total + item.calories!, 0);
      await diary.save();
      return {
        status: 200,
        body: {
          totalCalories: diary.totalCalories,
          length: diary.items.length,
          newItems: items.map(item => item._id.toHexString())
        }
      };
    }
  },
  deleteItem: {
    middleware: [auth],
    handler: async ({ params: { date }, req, body }) => {
      const diary = await DiaryModel.findOne({ user: req.authUser, date })
      if (!diary) {
        return {
          status: 404,
          body: {
            message: 'Not found'
          }
        }
      }

      const items2delete = Array.isArray(body) ? body : [body];
      items2delete.forEach(itemId => {
        let item = diary.items.id(itemId)
        if (!item) return
        item.deleteOne();
        diary.totalCalories -= item.calories!
        // .filter(item => item._id?.equals(itemId))
      })

      // diary.totalCalories! -= diary.items![Number(itemIdx)].calories!;
      diary.save();
      return {
        status: 200,
        body: {
          totalCalories: diary.totalCalories!,
          length: diary.items!.length
        }
      };
    }
  }
})

export { DiaryContract }