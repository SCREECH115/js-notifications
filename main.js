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

  constructor(handler, content, time, type, location) {
    this.#handler = handler;
    this.#content = content;
    this.#time = time;
    this.#startTime = time;
    this.#type = type;
    this.#location = location;
  }

  render(dom) {
    this.#elem = $.parseHTML(`<div class="notify">
    <div class="content"><h2><p style="color:red">ALERT</h2></div>
    <div class="content">CODE: <i>${this.#type}</i></div>
    <div class="content">${this.#location}</div>
    <div class="content">${hoursAndMinutes}</div>
    <div class="time"></div>
    </div>`);

    $(this.#elem).click((e) => {
      $(this.#elem).css("color", "green").css("filter", "brightness(130%)");
      clearInterval(this.#interval);
      setTimeout(() => {
        this.#remove();
      }, 3000);
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

  constructor(dom = $("#main"), maxSize = 6) {
    this.#dom = dom;
    this.#maxSize = maxSize;
  }

  addItem(content, time = 1000, type, location) {
    let item = null;
    if (content instanceof Toast) {
      item = content;
    } else {
      if (!content && !type && !location) throw new Error("No content");
      item = new Toast(this, content, time, type, location);
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
  toast.addItem("", 1100, 101, "Magellan Avenue");
  setTimeout(() => {
    toast.addItem("", 1200, 220, "Meteor Street");
    setTimeout(() => {
      toast.addItem("", 1300, 900, "San Andreas Avenue");
      setTimeout(() => {
        toast.addItem("", 1400, 960, "Mirror Park Boulevard");
        setTimeout(() => {
          toast.addItem("", 1500, 501, "Los Santos Airport");
          setTimeout(() => {
            toast.addItem("", 1600, 609, "Hawick Avenue");
          }, 2000);
        }, 2000);
      }, 2000);
    }, 2000);
  }, 2000);
};
