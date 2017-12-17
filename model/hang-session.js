const pg = require('./knex');

async function getSessions(userId, date) {
  const queryResult = await pg('hang_session')
    .leftJoin('hang', 'hang_session.id', 'hang.hang_session_id')
    .where({
      app_user_id: userId,
      date: date
    })
    .select(
      'hang_session.id as session_id',
      'hang_session.target_time as target_time',
      'hang_session.rest_time as rest_time',
      'hang.start',
      'hang.end');

  const sessionIds = queryResult.reduce((pre, cur) => ({...pre, [cur.session_id]: {...cur}}), {});
  const result = [];
  for (const sessionId of Object.keys(sessionIds)) {
    let sessionsHangs = queryResult.filter(r => +r.session_id === +sessionId);
    result.push({
      id: sessionId,
      restTime: sessionsHangs[0].rest_time,
      targetTime: sessionsHangs[0].target_time,
      hangs: sessionsHangs.map(s => ({ start: s.start, end: s.end }))
    });
  }

  return result;
}

async function addSession(userId, session) {
  // TODO
}

module.exports = {
  getSessions,
  addSession
}
