const { copyFileSync, existsSync, createReadStream } = require('fs');
const { v4: uuidv4 } = require('uuid');
const Router = require('koa-router');
const auth = require('../controllers/auth');

const upload_options = {
    multipart: true,
    formidable: {
        //sort of persistent (temp) uploads dir..
        uploadDir: '/var/tmp/api/uploads'
    }
};
const koaBody = require('koa-body')(upload_options);
const router = Router({ prefix: '/api' });
// uploads dir
const fileStore = '/var/tmp/api/public/images';

router.post('/images', auth, koaBody, async ctx => {
    try {
        //console.log(ctx.request);
        const { path } = ctx.request.files.upload;

        const imgName = uuidv4();
        const newPath = `${fileStore}/${imgName}`;
        copyFileSync(path, newPath);

        ctx.status = 201;
        ctx.body = {
            links: { path: router.url('get_image', imgName) }
        };
    } catch (error) {
        console.log(`error ${error.message}`);
        ctx.throw(500, 'Error uploading image', { message: error.message });
    }
});

router.get('get_image', '/images/:uuid([0-9a-f\\-]{36})', async ctx => {
    const uuid = ctx.params.uuid;
    const path = `${fileStore}/${uuid}`;
    //console.log(path);
    try {
        if (existsSync(path)) {
            //console.log('success');
            const src = createReadStream(path);
            ctx.type = 'image/jpeg';
            ctx.body = src;
            ctx.status = 200;
        } else {
            console.log('Not found');
            ctx.status = 404;
        }
    } catch (err) {
        console.log(`error ${err.message}`);
        ctx.throw(500, 'Error obtaining image', { message: err.message });
    }
});

module.exports = router;
