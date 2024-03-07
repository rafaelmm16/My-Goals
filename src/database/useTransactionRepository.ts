import { useSQLiteContext } from "expo-sqlite/next";

type TransactionCreateDatabase = {
  amount: number;
  goalId: number;
};

type TransactionResponseDatabase = {
  id: string;
  amount: number;
  goal_id: number;
  created_at: number;
};

export function useTransactionRepository() {
  const database = useSQLiteContext();

  function findLatest() {
    return database.getAllSync<TransactionResponseDatabase>(
      "SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10",
    );
  }

  function findByGoal(goalId: number) {
    const statement = database.prepareSync(
      "SELECT * FROM transactions WHERE goal_id = $goal_id",
    );

    const result = statement.executeSync<TransactionResponseDatabase>({
      $goal_id: goalId,
    });

    return result.getAllSync();
  }

  function create(transaction: TransactionCreateDatabase) {
    const statement = database.prepareSync(
      "INSERT INTO transactions (amount, goal_id) VALUES ($amount, $goal_id)",
    );

    statement.executeSync({
      $amount: transaction.amount,
      $goal_id: transaction.goalId,
    });
  }

  return {
    findByGoal,
    findLatest,
    create,
  };
}