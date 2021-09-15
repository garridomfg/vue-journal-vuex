import axios from 'axios'
import cloudinary from 'cloudinary'
import uploadImage from '@/modules/daybook/helpers/uploadImage'

cloudinary.config({
    cloud_name: 'dchklevyr',
    api_key: '375715252582693',
    api_secret: 'zB1T71IgI7n6PKF8kUrBasv0AHM'
})

describe('uploadImage tests', () => {
    test('should upload a file and return the url', async (done) => {
        const { data } = await axios.get('https://res.cloudinary.com/dchklevyr/image/upload/v1630693738/samples/ecommerce/leather-bag-gray.jpg', {
            responseType: 'arraybuffer'
        })
        const file = new File([data], 'picture.jpg')

        const url = await uploadImage(file)
        expect(typeof url).toBe('string')

        const segments = url.split('/')
        const imageId = segments[segments.length - 1].replace('.jpg', '')
        cloudinary.v2.api.delete_resources(imageId, {}, () => {
            done()
        })
    });
});