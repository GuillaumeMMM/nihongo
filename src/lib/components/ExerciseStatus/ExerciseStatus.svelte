<script lang="ts">
	let { rate }: { rate: number } = $props();

	// svelte-ignore non_reactive_update
	let status = { emoji: '⚪️', alt: 'not attempted' };

	if (rate > 0) {
		status = { emoji: '🔴', alt: 'not good enough' };
	}

	if (rate > 0.8) {
		status = { emoji: '🟡', alt: 'not great' };
	}

	if (rate > 0.9) {
		status = { emoji: '🟢', alt: 'good' };
	}

	if (rate > 0.9) {
		status = { emoji: '💚', alt: 'great, exercise validated' };
	}
</script>

<span aria-label="Test results for this exercise : {status.alt}">{status.emoji}</span>
