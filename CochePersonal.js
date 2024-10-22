class CochePersonal {
    constructor(x) {
        this.x = x;
        this.y = 380;
        this.largo = 10;
        this.ancho = 5;
        this.velocidad = 0;
    }

    display() {
        rect(this.x, this.y, this.largo, this.ancho)
    }
}