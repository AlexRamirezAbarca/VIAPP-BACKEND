export class CreatePhoto {

    _background: string;
    _color : string;
    _length: string;
    _size: string;
    _url : string;
  
    constructor() {
        this._background = 'FE6936';
        this._color = 'ffffff';
        this._length = '2';
        this._size = '200';
        this._url = 'https://ui-avatars.com/api/';
    }

    create(first_name: string, last_name: string) {
        try {

            const photo = `${this._url}?name=${first_name}+${last_name}&background=${this._background}&color=${this._color}&length=${this._length}&size=${this._size}`;
            return photo;

        } catch (error) {

            console.error(error);
            return `${this._url}?name=not+found&background=${this._background}&color=${this._color}&length=${this._length}&size=${this._size}`;
        }
    }
    

}