function padTo2Digits(num) {
  return String(num).padStart(2, "0");
}

const date = new Date();
const hoursAndMinutes =
  padTo2Digits(date.getHours()) + ":" + padTo2Digits(date.getMinutes());

class Toast {
  #content;
  #time;
  #handler;
  #startTime;
  #type;
  #location;
  #elem = null;
  #interval = null;
  #logo;
  #typeName;

  constructor(handler, content, time, type, typeName, location, logo) {
    this.#handler = handler;
    this.#content = content;
    this.#time = time;
    this.#startTime = time;
    this.#type = type;
    this.#typeName = typeName;
    this.#location = location;
    this.#logo = logo;
  }

  render(dom) {
    this.#elem = $.parseHTML(`<div class="notify">
    <div class="hour">${hoursAndMinutes}</div>    

    <div class="title">
      <div class="type">${this.#type}</div> 
      <div class="typeName">${this.#typeName}</div>
    </div>
    
    <div class="location">
      <ion-icon class="location-icon" name="location-outline"></ion-icon> 
      <div class="location-name">${this.#location}</div>
    </div>

    <div class="car">
      <ion-icon class="car-icon" name="car-outline"></ion-icon><div class="car-name">Kuruma</div>
      <ion-icon class="car-icon-plate" name="information-outline"></ion-icon><div class="car-plate">ABC-123</div>
    </div>

    <div class="buttons">
      <div class="button-join">Dołącz</div>
      <div class="button-location">Lokalizacja</div>
      <div class="players">
      <ion-icon class="players-icon" name="people-outline"></ion-icon>
      <div class="players-number">6</div>
      </div>
    </div>



    </div>`);

    $(this.#elem).click((e) => {
      $(this.#elem).css("filter", "brightness(130%)");
      $(this.#elem).find("hr").css("border", "1px solid #36aaf9");
      $(this.#elem).css("border", "1px solid #36aaf9");
      $(this.#elem).find(".content").css("padding", "1px");
      $(this.#elem).find(".logo").css("display", "none");
      $(this.#elem).css("opacity", "0.95").css("animation", "none");
      clearInterval(this.#interval);
      $(this.#elem).find(".time").css("width", "0%");
      $(this.#elem).off("click");
      // $(this.#elem).css("left", "-40%");
      $(this.#elem).click((e) => {
        $(this.#elem).remove();
        this.#handler.dequeue(this);
      });
    });

    $(dom).append(this.#elem);

    $(this.#elem).fadeIn(500, () => {
      this.#interval = setInterval(() => {
        this.#time -= 1;
        $(this.#elem)
          .find(".time")
          .css("width", `${Math.round((this.#time / this.#startTime) * 100)}%`);

        if (this.#time <= 0) {
          clearInterval(this.#interval);
          this.#remove();
        }
      });
    });
  }
  #remove() {
    $(this.#elem).fadeOut(500, () => {
      $(this.#elem).remove();
      this.#handler.dequeue(this);
    });
  }
}

class ToastManager {
  #dom;
  #toasts = [];
  #toastsQueue = [];
  #maxSize;

  constructor(dom = $("#main"), maxSize = 4) {
    this.#dom = dom;
    this.#maxSize = maxSize;
  }

  addItem(content, time = 1000, type, typeName, location) {
    let item = null;
    if (content instanceof Toast) {
      item = content;
    } else {
      if (!content && !type && !location && !typeName)
        throw new Error("No content");
      item = new Toast(this, content, time, type, typeName, location);
    }

    if (this.#toasts.length < this.#maxSize) {
      this.#toasts.push(item);
      item.render(this.#dom);
    } else {
      this.#toastsQueue.push(item);
    }
  }

  dequeue(elem) {
    this.#toasts = this.#toasts.filter((toast) => toast != elem);
    if (this.#toastsQueue.length <= 0) return;
    this.addItem(this.#toastsQueue.pop());
  }
}

window.onload = () => {
  const toast = new ToastManager();
  toast.addItem("", 5000, 101, "Active shooting", "Magellan Avenue");
  setTimeout(() => {
    toast.addItem("", 5000, 501, "Car theft", "Meteor Street");
    // setTimeout(() => {
    //   toast.addItem("", 5000, 900, "Bank robbery", "San Andreas Avenue");
    //   setTimeout(() => {
    //     toast.addItem("", 5000, 960, "Kidnapping", "Mirror Park Boulevard");
    //     setTimeout(() => {
    //       toast.addItem("", 5000, 801, "Shop robbery", "Los Santos Airport");
    //       setTimeout(() => {
    //         toast.addItem("", 5000, 609, "Prostitution", "Hawick Avenue");
    //       }, 3000);
    //     }, 3000);
    //   }, 3000);
    // }, 3000);
  }, 2000);
};
