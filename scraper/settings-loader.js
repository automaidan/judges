if (process.env.LOCAL_JUDGES_JSON) {
    process.env.LOCAL_JUDGES_JSON = !!process.env.LOCAL_JUDGES_JSON;
} else {
    process.env.LOCAL_JUDGES_JSON = false;
}

if (process.env.SCRAPPER_SPEED) {
    process.env.SCRAPPER_SPEED = parseInt(process.env.SCRAPPER_SPEED, 10);
} else {
    process.env.SCRAPPER_SPEED = 35;
}


if (process.env.PERSONS_LIMIT) {
    process.env.PERSONS_LIMIT = parseInt(process.env.PERSONS_LIMIT, 10);
} else {
    process.env.PERSONS_LIMIT = Infinity;
}
