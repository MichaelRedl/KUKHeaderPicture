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
}

export default class KukHeaderWebpartWebPart extends BaseClientSideWebPart<IKukHeaderWebpartWebPartProps> {

  public render(): void {

    this.createHeaderPicture();
    /* this.domElement.innerHTML = `
       <div class="${styles.kukHeaderWebpart}">
         <div class="${styles.container}">
           <div class="${styles.row}">
             <div class="${styles.column}">
               <span class="${styles.title}">Welcome to SharePoint!</span>
               <p class="${styles.subTitle}">Customize SharePoint experiences using Web Parts.</p>
               <p class="${styles.description}">${escape(this.properties.description)}</p>
               <a href="https://aka.ms/spfx" class="${styles.button}">
                 <span class="${styles.label}">Learn more</span>
               </a>
             </div>
           </div>
         </div>
       </div>`;*/
  }

  /* protected get dataVersion(): Version {
     return Version.parse('1.0');
   }
 */
  private async createHeaderPicture(): Promise<string> {
    try {
      const requestUrl = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('Site Assets')/items?$filter=FileLeafRef eq 'HeaderPicture.jpg'&$select=FileRef`;
      const response = await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1);
      const items = await response.json();

      if (items.value && items.value.length > 0) {
        //alert(items.value[0].FileRef);
        this.domElement.innerHTML = `
        <div class = "${styles.headerImageContainer}" style = "height:${this.properties.height}px"><img src = "${items.value[0].FileRef}" class = "${styles.headerImage}"></img> </div>`;
        return items.value[0].FileRef;

      } else {
        throw new Error('No picture found');
      }
    } catch (error) {
      throw error;
    }
  }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
              /*  PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),*/
                PropertyPaneSlider('height', {
                  label: "Height",
                  min: 0,
                  max: 1000,
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
