import type { ModuleCard } from '$lib/types/module';

export function shuffleCards(cards: ModuleCard[]) {
	const remainingCards = [...cards];
	const newCards: ModuleCard[] = [];
	while (remainingCards.length > 0) {
		const randIndex = Math.trunc(Math.random() * remainingCards.length);
		const randomCard = remainingCards[randIndex];
		if (
			newCards.length === 0 ||
			cards.length <= 1 ||
			randomCard.q !== newCards[newCards.length - 1]?.q
		) {
			//  Only add a card if it's different from the previous card picked
			newCards.push(randomCard);
			remainingCards.splice(randIndex, 1);
		}
	}
	return newCards;
}
