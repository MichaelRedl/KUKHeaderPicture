import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneButton
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient } from '@microsoft/sp-http';
import styles from './KukHeaderWebpartWebPart.module.scss';
import * as strings from 'KukHeaderWebpartWebPartStrings';

export interface IKukHeaderWebpartWebPartProps {
  description: string;
  height: number;
  header1: string,
  header2: string,
  imageURL: string,
  fontSize: number;
  fontSize1: number;
}

export interface IKukHeaderWebpartWebPartState {
  isCollapsed: boolean;
}


export default class KukHeaderWebpartWebPart extends BaseClientSideWebPart<IKukHeaderWebpartWebPartProps> {
  private isCollapsed: boolean = false;
  protected onInit(): Promise<void> {
    if (this.properties.header1 === undefined) {
      this.properties.header1 = 'Überschrift 1';
    }
    if (this.properties.header2 === undefined) {
      this.properties.header2 = 'Überschrift 1';
    }
    if (!this.properties.height) {
      this.properties.height = 250;
    }
    if (!this.properties.fontSize) {
      this.properties.fontSize = 36;
    }
    if (!this.properties.fontSize1) {
      this.properties.fontSize1 = 26;
    }
    return Promise.resolve();
  }

  public render(): void {

    this.createHeaderPicture2();
  }

  private collapseHeader(): void {
    this.isCollapsed = !this.isCollapsed;
    this.render();
  }
  private async createHeaderPicture2(): Promise<string> {
    try {
      if (this.properties.imageURL != "") {
        console.log("!imageurl");
        console.log(typeof (this.properties.imageURL));
        if (this.isCollapsed == false) {
          this.domElement.innerHTML = `
        <div class="${styles.imageOverlayContainer}" style="height:${this.properties.height}px">
          <img src="${this.properties.imageURL}" class="${styles.backgroundImage}" />
          <div class="${styles.textOverlay}">
            <h1 class="${styles.headerText}" style="font-size:${this.properties.fontSize1}px">${this.properties.header1}</h1>
            <h2 class="${styles.headerText}" style="font-size:${this.properties.fontSize}px">${this.properties.header2}</h2>
          </div>
        </div>
        <button id="chevronButton" class="${styles.chevronButton}"></button>`;
        } else {
          this.domElement.innerHTML = ` <button id="chevronButton" class="${styles.chevronButton}"></button>`;
        }
      }
      else {
        const imgURL = require('./defaultImage.jpg');
        console.log(imgURL);
        if (this.isCollapsed == false) {
          this.domElement.innerHTML = `
        <div class="${styles.imageOverlayContainer}" style="height:${this.properties.height}px">
          <img src="${imgURL}" class="${styles.backgroundImage}" />
          <div class="${styles.textOverlay}">
          <h1 class="${styles.headerText}" style="font-size:${this.properties.fontSize1}px">${this.properties.header1}</h1>
          <h2 class="${styles.headerText}" style="font-size:${this.properties.fontSize}px">${this.properties.header2}</h2>
          </div>
        </div>
        <button id="chevronButton" class="${styles.chevronButton}"></button>`;
        }
        else {
          this.domElement.innerHTML = ` <button id="chevronButton" class="${styles.chevronButton}"></button>`;
        }
      }
      const chevronButton = this.domElement.querySelector('#chevronButton');
      if (chevronButton) {
        chevronButton.addEventListener('click', () => this.collapseHeader());
      }
      return this.properties.imageURL;
    } catch (error) {
      throw error;
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          /* header: {
             description: strings.PropertyPaneDescription
           },*/
          groups: [
            {
              //groupName: strings.BasicGroupName,
              groupName: 'Einstellungen',
              groupFields: [
                PropertyPaneTextField('header1', { // 'heading1' is the internal property name.
                  label: "Überschrift 1", // This is the label that will be displayed in the properties pane.
                  value: this.properties.header1
                }),
                PropertyPaneSlider('fontSize1', {
                  label: "Schriftgröße in px",
                  min: 10,
                  max: 60,
                  step: 1,
                  value: this.properties.height
                }),
                PropertyPaneTextField('header2', { // 'heading2' is the internal property name.
                  label: "Überschrift 2", // This is the label that will be displayed in the properties pane.
                  value: this.properties.header2
                }),
                PropertyPaneSlider('fontSize', {
                  label: "Schriftgröße in px",
                  min: 10,
                  max: 60,
                  step: 1,
                  value: this.properties.height
                }),
                PropertyPaneTextField('imageURL', {
                  label: "Hintergrundfoto URL", // This label will appear in the property pane
                  value: this.properties.imageURL
                }),
                PropertyPaneSlider('height', {
                  label: "Höhe",
                  min: 100,
                  max: 700,
                  step: 1,
                  value: this.properties.height
                }),


              ]
            }
          ]
        }
      ]
    };
  }
}
