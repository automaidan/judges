interface IAboutController {
  activate($timeout: angular.ITimeoutService): void;
}

class AboutController implements IAboutController {
  /* @ngInject */
  constructor($timeout: angular.ITimeoutService) {
    console.log('Hello About');
  }

  /** @ngInject */
  activate($timeout: angular.ITimeoutService) {
  }
}

export { AboutController };
