function shouldPreventOnUpdate({
	transaction,
}: {
	transaction: any;
}) {
	// Fix writing accents and diacritics in Safari.
	const ignoredChars = new Set(["`", "´", "¨", "ˆ", "˜"]);

	const insertedChar =
		transaction?.steps?.[0]?.slice?.content?.content?.[0]?.text;
	if (ignoredChars.has(insertedChar)) {
		return true;
	}

	return false;
}

export default shouldPreventOnUpdate;