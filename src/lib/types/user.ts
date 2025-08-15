export type User = {
	username: string;
};

export type UserData = {
	exercises: { [key: string]: { answers: number; date: string }[] };
};
