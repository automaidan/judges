/**
 * Created by IlyaLitvinov on 27.07.16.
 */
const escapeRegExp = (str: string) => {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

export { escapeRegExp };
