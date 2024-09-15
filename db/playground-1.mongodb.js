/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('cal-trk');

// Here we run an aggregation and open a cursor to the results.
// Use '.toArray()' to exhaust the cursor to return the whole result set.
// You can use '.hasNext()/.next()' to iterate through the cursor page by page.
// [1, 2, 3, 4].forEach(bloodType => {
for (const bloodType of [1, 2, 3, 4]) {
  db.getCollection('products').aggregate([
    // { $match: { 'groupBloodNotAllowed.1': true } },
    { $group: { _id: '$categories', avg1: { $avg: { $toInt: { $arrayElemAt: ['$groupBloodNotAllowed', bloodType] } } } } },
    { $match: { 'avg1': { $gt: 0 } } },
    { $group: { _id: { $round: ["$avg1", 2] }, categories: { $push: '$_id' } } },
    { $set: { _id: { prob: '$_id', bloodType: bloodType } } },
    // { $project: { avg1: 0, _id: 0 } },
    { $merge: 'groupBloodNotAllowed' }

  ]);
};

/* for (const bloodType of [2]) {
  db.getCollection('products').aggregate([
    { $match: { $expr: { $arrayElemAt: ['$groupBloodNotAllowed', bloodType] } } },
    { $group: { _id: '$categories', titles: { $push: '$title' }, count: { $sum: 1 } } },
    { $set: { _id: { categories: '$_id', bloodType: bloodType } } },

  ]);
} */

/* db.getCollection('products').aggregate([
  { $group: { _id: '$categories', titles: { $sum: 1 } } },

]); */