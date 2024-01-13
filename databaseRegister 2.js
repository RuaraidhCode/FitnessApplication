const express = require('express');
const { Client } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();

const client = new Client({
  host: '192.168.1.235',
  user: 'postgres',
  port: 5439,
  database: 'postgres', // Replace with your database name
});

const app = express();
const PORT = 5003;


client.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to the database!');
  }
});

app.use(express.json());

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
// Inside your /login endpoint
console.log('Received login request:');
console.log('Username:', username);
console.log('Password:');

// Retrieve the user from the database based on the username
try {
  const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = result.rows[0];

  console.log('Retrieved user from database:');
  console.log('User:', user);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Compare the provided password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, user.pass_word);
  console.log('Password Match:', passwordMatch);

  if (passwordMatch) {
    // Passwords match, generate and return an access token
    const accessToken = jwt.sign(
      { user_id: user.user_id, username: user.username },
      'your-hardcoded-secret-key'
    );
    return res.json({
      accessToken: accessToken,
      username: user.username,
      user_id: user.user_id,
    });
  } else {
    return res.status(401).json({ message: 'Invalid password' });
  }
} catch (err) {
  console.error('Error querying database:', err);
  return res.status(500).json({ message: 'Internal server error' });
}
});


// Endpoint for user registration
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    console.log('attemoting to post!!!')
    // Check if the username or email already exists in the database
    const existingUser = await client.query(
      'SELECT * FROM register_user WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // If the username and email are unique, insert the new user into the database
    await client.query(
      'INSERT INTO register_user (username, email, hashed_password) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/users', async (req, res) => {
    
    console.log('Before query execution');
try {
    const Qresult = await client.query('SELECT * FROM users;');
    const userDetails = Qresult.rows.map((row) => row);
    //console.log('Inside the try block - result.rows:', userDetails);
    userDetails.forEach((user) => {
        console.log('Inside the try block - username: ', user.username);
        console.log('Inside the try block - password: ', user.pass_word);
        console.log('')
      });



    res.json(userDetails);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  console.log('After query execution2');
});



app.post('/api/updateSex', async (req, res) => {
    const { sex } = req.body;
  
    try {
      const user_id = req.body.userInfo.user_id;
      
      await client.query('UPDATE users SET gender = $1 WHERE user_id = $2;', [sex, user_id]);
      res.status(200).json({ message: 'Gender updated successfully' });
    } catch (error) {
      console.log('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.post('/api/updateHeight', async (req, res) => {
    const { height } = req.body;

    try {
      const user_id = req.body.userInfo.user_id;
      
      await client.query('UPDATE users SET height = $1 WHERE user_id = $2;', [height, user_id]);
      res.status(200).json({ message: 'Height updated successfully' });
    } catch (error) {
      console.log('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.post('/api/updateWeight', async (req, res) => {
    const { weight } = req.body;

    try {
      const user_id = req.body.userInfo.user_id;
      
      await client.query('UPDATE users SET weight = $1 WHERE user_id = $2;', [weight, user_id]);
      res.status(200).json({ message: 'Weight updated successfully' });
    } catch (error) {
      console.log('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  app.post('/api/updateAge', async (req, res) => {
    const { age } = req.body;

    try {
      const user_id = req.body.userInfo.user_id;
      
      await client.query('UPDATE users SET age = $1 WHERE user_id = $2;', [age, user_id]);
      res.status(200).json({ message: 'Age updated successfully' });
    } catch (error) {
      console.log('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  app.post('/api/addNewGoal', async (req, res) => {
    const { goal } = req.body;

    try {
      const user_id = req.body.userInfo.user_id;
      
      await client.query(
        `
        INSERT INTO goals (user_id, goal_category, goal_description, goals_start_date, goals_target_date, goal_status)
        VALUES ($1, $2, $3, $4, $5, $6);
        `,
        [user_id, goal.category, goal.goalDescription, goal.startDate, goal.targetDate, 'In Progress']
      );
      res.status(200).json({ message: 'Goal added successfully' });
    } catch (error) {
      console.log('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  app.get('/api/checkUserGoalAchievement', async (req, res) => {
    try {
      const { user_id } = req.query;

      const Qresult = await client.query('SELECT * FROM goals WHERE user_id = $1;', [user_id])
      const goalList = Qresult.rows;
  
      res.json(goalList);
    } catch (error) {
      console.log('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/checkUserAchievementId-1', async (req, res) => {
    try {
      const { user_id } = req.query;

      const Qresult = await client.query('SELECT * FROM user_achievements WHERE user_id = $1 AND achievement_id = 1;', [user_id])
      const achievementList = Qresult.rows;
  
      res.json(achievementList);
    } catch (error) {
      console.log('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/updateGoalAchievement', async (req, res) => {
    const { userInfo, achievementToSend } = req.body;
    console.log('Received user_id from frontend:', userInfo);
  
    try {
      const updateUserAchievement = `
      INSERT INTO user_achievements (user_id, achievement_id) VALUES
      ($1, $2);`;

      await client.query(updateUserAchievement, [userInfo.user_id, achievementToSend]);


      res.status(200).json({ message: 'Goal achievement saved successfully'});
    } catch (error) {
      console.error('Error saving goal achievement:', error);
      res.status(500).json({ error: 'An error occurred while saving the goal achievement' });
    }
  });

  app.get('/api/checkUserFirstWorkoutAchievement', async (req, res) => {
    try {
      const { user_id } = req.query;

      const Qresult = await client.query('SELECT * FROM workout_history WHERE user_id = $1;', [user_id])
      const workoutList = Qresult.rows;
  
      res.json(workoutList);
    } catch (error) {
      console.log('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/updateFirstWorkoutAchievement', async (req, res) => {
    const { userInfo } = req.body;
    console.log('Received user_id from frontend:', userInfo);
  
    try {
      const updateUserAchievement = `
      INSERT INTO user_achievements (user_id, achievement_id) VALUES
      ($1, 1);`;

      await client.query(updateUserAchievement, [userInfo.user_id]);


      res.status(200).json({ message: 'First Workout achievement saved successfully'});
    } catch (error) {
      console.error('Error saving goal achievement:', error);
      res.status(500).json({ error: 'An error occurred while saving the first workout achievement' });
    }
  });



  app.get('/api/exercise', async (req, res) => {
    
    console.log('Before query execution');
try {
    const Qresult = await client.query('SELECT * FROM exercises ORDER BY exercise_name;');
    const exerciseDetails = Qresult.rows.map((row) => row);
    res.json(exerciseDetails);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  console.log('After query execution');
});


app.post('/api/newExercise', async (req, res) => {
  const newExercise = req.body;
  console.log('Received new Exercise from frontend:', newExercise);
 try {
    
    await client.query('INSERT INTO exercises (exercise_name, body_part, equipment) VALUES ($1, $2, $3)', [
      newExercise.exerciseName,
      newExercise.bodyPart,
      newExercise.category
    ]);

    res.status(200).json({ success: true, message: 'New exercise successfully added' });
  } catch (error) {
    // Handle errors
    console.error('Error adding an exercise:', error);
    res.status(500).json({ error: 'An error occurred while adding an exercise' });
  }
});


app.post('/api/saveWorkout', async (req, res) => {
  const { workout, userInfo } = req.body;
  console.log('Received workout from frontend:', workout);

  try {
    const { timerValue } = workout;

    // Insert workout data into workout_history table
    const insertWorkoutHistoryQuery = `
      INSERT INTO workout_history (user_id, workout_date, duration, workout_count)
      VALUES ($1, NOW(), $2, (SELECT COALESCE(MAX(workout_count), 0) + 1 FROM workout_history WHERE user_id = $1))
      RETURNING workout_history_id;    
    `;

    const workoutHistoryResult = await client.query(insertWorkoutHistoryQuery, [
      userInfo.user_id,
      timerValue
    ]);

    const workoutHistoryId = workoutHistoryResult.rows[0].workout_history_id;

    // Insert workout details into workout_history_details table
    for (const exercise of workout.workout) {
      const { exerciseName, sets } = exercise;
      const insertWorkoutDetailsQuery = `
        INSERT INTO workout_history_details (workout_history_id, exercise_name, sets_and_reps)
        VALUES ($1, $2, $3);
      `;

      await client.query(insertWorkoutDetailsQuery, [
        workoutHistoryId,
        exerciseName,
        JSON.stringify(sets)
      ]);
    }

    res.status(200).json({ message: 'Workout saved successfully', workout_history_id: workoutHistoryId });
  } catch (error) {
    console.error('Error saving workout:', error);
    res.status(500).json({ error: 'An error occurred while saving the workout' });
  }
});





    


app.get('/api/workoutHistory', async (req, res) => {
  const { user_id } = req.query;
  try {
    const Qresult = await client.query('SELECT * FROM workout_history WHERE user_id = $1;', [user_id]);
    const workoutHistory = Qresult.rows;

    const workoutHistoryDetails = await Promise.all(
      workoutHistory.map(async (historyItem) => {
        const detailsResult = await client.query(
          'SELECT * FROM workout_history_details WHERE workout_history_id = $1;',
          [historyItem.workout_history_id]
        );
        return {
          ...historyItem,
          details: detailsResult.rows,
        };
      })
    );

    res.json(workoutHistoryDetails);
    console.log(workoutHistoryDetails)
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/workoutHistoryMaxCount', async (req, res) => {
  const { user_id } = req.query;
  try {
    const Qresult = await client.query('SELECT * FROM workout_history WHERE user_id = $1 AND workout_count = ( SELECT MAX(workout_count) FROM workout_history  WHERE user_id = $1);', [user_id]);
    const workoutHistoryMax = Qresult.rows;

    res.json(workoutHistoryMax);
    console.log(workoutHistoryMax)
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/createCompetition', async (req, res) => {
  const { compPackage, userInfo } = req.body;
  console.log('Received compPackage from frontend:', compPackage);

  try {
      // Insert competition information into the competition table
    const insertCompPackageQuery = `
      INSERT INTO competition (comp_name, comp_category, comp_type, comp_duration, comp_start_date, comp_end_date, team_one_name, team_two_name, team_one_colour, team_two_colour)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING comp_id;
    `;
    const { rows: [competitionRow] } = await client.query(insertCompPackageQuery, [
      compPackage.compName, compPackage.compCategory, compPackage.compType,
      compPackage.compDuration, compPackage.compStartDate, compPackage.compEndDate,
      compPackage.teamNameOne, compPackage.teamNameTwo,
      compPackage.teamColourOne, compPackage.teamColourTwo
    ]);
  
    const compId = competitionRow.comp_id;

    let teamIds = [];

    if (compPackage.compType === 'Team') {
      const insertTeamsQuery = `
        INSERT INTO team (comp_id, team_name, team_colour)
        VALUES ($1, $2, $3), ($4, $5, $6)
        RETURNING team_id, team_name, team_colour;
      `;
      const { rows: [teamOneRow, teamTwoRow] } = await client.query(insertTeamsQuery, [
        compId, compPackage.teamNameOne, compPackage.teamColourOne,
        compId, compPackage.teamNameTwo, compPackage.teamColourTwo
      ]);

      teamIds.push(teamOneRow.team_id, teamTwoRow.team_id);

      if (teamIds.length === 2) {
        const updateCompetitionQuery = `
          UPDATE competition
          SET team_one_id = $1, team_two_id = $2
          WHERE comp_id = $3;
        `;
        await client.query(updateCompetitionQuery, [teamIds[0], teamIds[1], compId]);
      }
    } 


    res.status(200).json({ message: 'compPackage saved successfully', teamIds });
  } catch (error) {
    console.error('Error saving compPackage:', error);
    res.status(500).json({ error: 'An error occurred while saving the compPackage' });
  }
});


app.get('/api/competitionList', async (req, res) => {
  try {
    const Qresult = await client.query('SELECT * FROM competition;');
    const competitionList = Qresult.rows;

    res.json(competitionList);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
    

app.post('/api/addCompetitor', async (req, res) => {
  const { statsPackage, userInfo } = req.body;
  console.log('Received createStatsPackage from frontend:', statsPackage);

  try {
    // Check if the user is already in any competition
    const existingCompetitorQuery = `
      SELECT * FROM weekly_progress
      WHERE user_id = $1;
    `;

    const existingCompetitorResult = await client.query(existingCompetitorQuery, [userInfo.user_id]);

    if (existingCompetitorResult.rows.length > 0) {
      // User is already part of a competition, return an error response
      return res.status(400).json({ error: 'User is already part of a competition' });
    }

    // If the user is not in any competition, proceed to insert their information
    const createStatsPackageQuery = `
      INSERT INTO weekly_progress (comp_id, user_id, comp_name, team_id, weight, weight_changes, points)
      VALUES ($1, $2, $3, $4, $5, ARRAY[$6]::NUMERIC[], $7);
    `;

    await client.query(createStatsPackageQuery, [
      statsPackage.chosenCompID,
      userInfo.user_id,
      statsPackage.compName,
      statsPackage.selectedTeamId,
      statsPackage.weight,
      statsPackage.weight,
      statsPackage.points,
    ]);

    res.status(201).json({ message: 'User added to the competition successfully' });
  } catch (error) {
    console.error('Error saving team competitor:', error);
    res.status(500).json({ error: 'An error occurred while saving the compPackage' });
  }
});


app.post('/api/updateCompetitorWeight', async (req, res) => {
  const { statsPackage, userInfo } = req.body;

  try {
    // Fetch the existing weight_changes array
    const fetchWeightChangesQuery = `
      SELECT weight_changes FROM weekly_progress
      WHERE user_id = $1 AND comp_id = $2;
    `;
    const fetchResult = await client.query(fetchWeightChangesQuery, [userInfo.user_id, statsPackage.compId]);
    const existingWeightChanges = fetchResult.rows[0].weight_changes || [];

    // Add the new weight to the existing array
    const updatedWeightChanges = [...existingWeightChanges, statsPackage.weight];

    // Update the weight_changes array in the database
    const updateWeightChangesQuery = `
      UPDATE weekly_progress
      SET weight = $1, weight_changes = $2, points = $3
      WHERE user_id = $4 AND comp_id = $5;
    `;
    await client.query(updateWeightChangesQuery, [statsPackage.weight, updatedWeightChanges, statsPackage.newUserPoints, userInfo.user_id, statsPackage.compId]);

    res.status(200).json({ message: 'compPackage updated successfully' });
  } catch (error) {
    console.error('Error updating compPackage:', error);
    res.status(500).json({ error: 'An error occurred while updating the compPackage' });
  }
});


app.get('/api/receiveWeeklyProgess', async (req, res) => {
  const { user_id } = req.query; 
  try {
    const Qresult = await client.query('SELECT * FROM weekly_progress WHERE user_id = $1;', [user_id]);
    const userList = Qresult.rows;
    console.log("the user list ---> ", userList)

    res.json(userList);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/receiveWeeklyProgessCompetitorNumber', async (req, res) => {
  const { user_id } = req.query; 
  try {
    const Qresult = await client.query('SELECT * FROM weekly_progress');
    const userList = Qresult.rows;
    console.log("the competitor list ---> ", userList)

    res.json(userList);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/api/leaderboardList', async (req, res) => {
  try {
    const Qresult = await client.query('SELECT * FROM leaderboard ORDER BY points DESC;');
    const leaderboardList = Qresult.rows;

    res.json(leaderboardList);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/finshedSoloLeaderboardList', async (req, res) => {
  try {
    const Qresult = await client.query('SELECT * FROM solo_final_standings ORDER BY points DESC;');
    const leaderboardList = Qresult.rows;

    res.json(leaderboardList);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/finshedTeamLeaderboardList', async (req, res) => {
  try {
    const Qresult = await client.query('SELECT * FROM team_final_standings ORDER BY points DESC;');
    const leaderboardList = Qresult.rows;

    res.json(leaderboardList);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/teamLeaderboardList', async (req, res) => {
  try {
    const Qresult = await client.query('SELECT * FROM team_table ORDER BY points DESC;');
    const teamLeaderboardList = Qresult.rows;

    res.json(teamLeaderboardList);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/setCompletedCompLeaderboard', async (req, res) => {
  const { user_id } = req.body;
  console.log('Received user_id from frontend:', user_id);

  try {
    // Check if the competition is already marked as completed based on comp_id
    const checkCompletedQuery = 'SELECT completed, is_marked_completed FROM competition WHERE comp_id = (SELECT comp_id FROM weekly_progress WHERE user_id = $1)';
    const { rows } = await client.query(checkCompletedQuery, [user_id]);

    if (rows.length === 1) {
      const { completed, is_marked_completed } = rows[0];

      if (completed === true) {
        // The competition is already completed, do not proceed
        console.log('Competition is already marked as completed. Request not executed.');
        res.status(400).json({ message: 'Competition is already marked as completed. Request not executed.' });
        return;
      }

      if (is_marked_completed === false) {
        console.log('Going throught the process of marking the comp as completed.');
        // Mark the competition as completed and set is_marked_completed to true
        const updateCompletedQuery = 'UPDATE competition SET completed = true, is_marked_completed = true WHERE comp_id = (SELECT comp_id FROM weekly_progress WHERE user_id = $1)';
        await client.query(updateCompletedQuery, [user_id]);

        const insertQuery = `
          INSERT INTO solo_final_standings (comp_id, user_id, comp_name, username, weight, weight_changes, week_number, points, comp_end_date, comp_start_date)
          SELECT wp.comp_id, wp.user_id, wp.comp_name, ru.username, wp.weight, wp.weight_changes, wp.week_number, wp.points, c.comp_end_date, c.comp_start_date
          FROM weekly_progress wp
          JOIN register_user ru ON wp.user_id = ru.user_id
          JOIN competition c ON wp.comp_id = c.comp_id
          WHERE wp.comp_id = (SELECT comp_id FROM weekly_progress WHERE user_id = $1)
          ORDER BY wp.points DESC;
        `;

        await client.query(insertQuery, [user_id]);

        console.log('Successfully populated solo_final_standings for competition (sorted by points in descending order).');
        res.status(200).json({ message: 'Successfully populated solo_final_standings for competition (sorted by points in descending order).' });
      } else {
        // Another user already marked the competition as completed, do not proceed
        console.log('Competition is already marked as completed by another user. Request not executed.');
        res.status(400).json({ message: 'Competition is already marked as completed by another user. Request not executed.' });
      }
    } else {
      console.log('Competition not found. Request not executed.');
      res.status(400).json({ message: 'Competition not found. Request not executed.' });
    }
  } catch (error) {
    console.error('Error populating solo_final_standings:', error);
    res.status(500).json({ error: 'An error occurred while populating solo_final_standings.' });
  }
});



app.post('/api/setCompletedTeamCompLeaderboard', async (req, res) => {
  const { user_id } = req.body;
  console.log('Received user_id from frontend:', user_id);

  try {
    // Check if the competition is already marked as completed based on comp_id
    const checkCompletedQuery = 'SELECT completed, is_marked_completed FROM competition WHERE comp_id = (SELECT comp_id FROM weekly_progress WHERE user_id = $1)';
    const { rows } = await client.query(checkCompletedQuery, [user_id]);

    if (rows.length === 1) {
      const { completed, is_marked_completed } = rows[0];

      if (completed === true) {
        // The competition is already completed, do not proceed
        console.log('Competition is already marked as completed. Request not executed.');
        res.status(400).json({ message: 'Competition is already marked as completed. Request not executed.' });
        return;
      }

      if (is_marked_completed === false) {
        // Mark the competition as completed and set is_marked_completed to true
        const updateCompletedQuery = 'UPDATE competition SET completed = true, is_marked_completed = true WHERE comp_id = (SELECT comp_id FROM weekly_progress WHERE user_id = $1)';
        await client.query(updateCompletedQuery, [user_id]);

        const insertQuery = `
          INSERT INTO team_final_standings (comp_id, user_id, comp_name, username, weight, weight_changes, week_number, points, team_id, team_name, team_colour, comp_end_date, comp_start_date)
          SELECT wp.comp_id, wp.user_id, wp.comp_name, ru.username, wp.weight, wp.weight_changes, wp.week_number, wp.points, t.team_id, t.team_name, t.team_colour, c.comp_end_date, c.comp_start_date
          FROM weekly_progress wp
          JOIN register_user ru ON wp.user_id = ru.user_id
          JOIN team t ON wp.team_id = t.team_id
          JOIN competition c ON wp.comp_id = c.comp_id
          WHERE wp.comp_id = (SELECT comp_id FROM weekly_progress WHERE user_id = $1)
          ORDER BY wp.points DESC;
        `;

        await client.query(insertQuery, [user_id]);

        console.log('Successfully populated team_final_standings for competition (sorted by points in descending order).');
        res.status(200).json({ message: 'Successfully populated team_final_standings for competition (sorted by points in descending order).' });
      } else {
        // Another user already marked the competition as completed, do not proceed
        console.log('Competition is already marked as completed by another user. Request not executed.');
        res.status(400).json({ message: 'Competition is already marked as completed by another user. Request not executed.' });
      }
    } else {
      console.log('Competition not found. Request not executed.');
      res.status(400).json({ message: 'Competition not found. Request not executed.' });
    }
  } catch (error) {
    console.error('Error populating team_final_standings:', error);
    res.status(500).json({ error: 'An error occurred while populating team_final_standings.' });
  }
});

app.post('/api/removeOldLeaderboard', async (req, res) => {
  const { user_id } = req.body;

  try {
    // Check if the user is part of a solo competition
    const isSoloCompetitionQuery = 'SELECT team_id FROM weekly_progress WHERE user_id = $1 LIMIT 1';
    const { rows: soloRows } = await client.query(isSoloCompetitionQuery, [user_id]);

    if (soloRows.length === 0 || soloRows[0].team_id === null) {
      // User is part of a solo competition, remove from leaderboard
      console.log('User is part of a solo competition, remove from leaderboard');
      const removeSoloLeaderboardQuery = 'DELETE FROM leaderboard WHERE user_id = $1';
      await client.query(removeSoloLeaderboardQuery, [user_id]);

      console.log('Successfully removed user from solo leaderboard.');
      res.status(200).json({ message: 'Successfully removed user from solo leaderboard.' });
    } else {
      // User is part of a team competition, remove from team_table
      console.log('User is part of a team competition, remove from team_table');
      const removeTeamLeaderboardQuery = 'DELETE FROM team_table WHERE user_id = $1';
      await client.query(removeTeamLeaderboardQuery, [user_id]);

      console.log('Successfully removed user from team leaderboard.');
      res.status(200).json({ message: 'Successfully removed user from team leaderboard.' });
    }
  } catch (error) {
    console.error('Error removing user from leaderboard:', error);
    res.status(500).json({ error: 'An error occurred while removing the user from the leaderboard.' });
  }
});

  




app.get('/api/receiveAchievement', async (req, res) => {
  try {
    const { user_id } = req.query;
    const query = {
      text: 'SELECT * FROM user_achievement_details WHERE user_id = $1',
      values: [user_id], 
    };
    const Qresult = await client.query(query);
    const achievementList = Qresult.rows;
    console.log('recieving the user achievements')

    res.json(achievementList);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/receiveAllAchievements', async (req, res) => {
  try {
    const Qresult = await client.query('SELECT * FROM achievements')
    const achievementList = Qresult.rows;

    res.json(achievementList);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/receiveProfilePic', async (req, res) => {
  const { user_id } = req.query; 
  try {
    const Qresult = await client.query('SELECT * FROM users WHERE user_id = $1;', [user_id]);
    const userList = Qresult.rows;
    console.log("the user lsit ---> ", userList)

    res.json(userList);
  } catch (error) {
    console.log('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/api/saveProfilePic', async (req, res) => {
  try {
    const { profilePicPackage, userInfo } = req.body;
    console.log('Received profilePicPackage from frontend:', profilePicPackage);

    const insertQuery = `
      UPDATE users
      SET picture = $1
      WHERE user_id = $2
    `;

    await client.query(insertQuery, [profilePicPackage.profilePic, userInfo.user_id]);

    res.status(200).json({ message: 'Profile picture updated successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error saving profile picture:', error);
    res.status(500).json({ error: 'An error occurred while saving the profile picture' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});