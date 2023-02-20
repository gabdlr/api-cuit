import { sociedad } from "./sociedad.model";

export function parseResponse(html: string = "") {
  let startPosition = html.search(
    /<table class="table table-spaced table-hover tabla-condensed dataTable table-sociedad">/
  );
  let endPosition = html.search(/ <label><b>Información fuente AFIP/);
  let info = html.substring(startPosition, endPosition);
  const keyElementsPosition: number[] = [];
  let lastElementPosition = 0;
  let thereAreMoreElements = true;
  let auxInfo = info;

  while (thereAreMoreElements) {
    let elementPosition = auxInfo.search(/<strong>/);
    if (elementPosition > -1) {
      lastElementPosition += elementPosition + 8;
      keyElementsPosition.push(lastElementPosition);
      auxInfo = auxInfo.substring(elementPosition + 8);
    } else {
      elementPosition = auxInfo.search(/N">/);
      lastElementPosition += elementPosition + 3;
      keyElementsPosition.push(lastElementPosition);
      thereAreMoreElements = false;
    }
  }

  let companyDataArray: string[] = [];
  for (let i = 0; i < keyElementsPosition.length; i++) {
    let substring = info.substring(
      keyElementsPosition[i],
      keyElementsPosition[i + 1]
    );
    let data: string = "";
    let valuePositionStart = substring.search(/<p>/) + 3;
    let valuePositionEnd = substring.search(/<\/p>/);
    data = substring.substring(valuePositionStart, valuePositionEnd);
    companyDataArray.push(data);
  }

  const sociedad: sociedad = {
    sociedad: {
      razonSocial: companyDataArray[0],
      cuit: companyDataArray[1],
      tipoSocietario: companyDataArray[2],
      fechaDeContrato: companyDataArray[3],
      numeroRegistroLocal: companyDataArray[4],
    },
    domicilioFiscal: {
      provincia: companyDataArray[5],
      localidad: companyDataArray[6],
      domicilio: companyDataArray[7],
      pisoDeptoOfi: companyDataArray[8],
      codigoPostal: companyDataArray[9],
      estadoDeDomicilio: companyDataArray[10],
    },
    domicilioLegal: {
      provincia: companyDataArray[11],
      localidad: companyDataArray[12],
      domicilio: companyDataArray[13],
      pisoDeptoOfi: companyDataArray[14],
      codigoPostal: companyDataArray[15],
      estadoDeDomicilio: companyDataArray[16],
    },
    fechaActualizacion: companyDataArray[17],
  };
  if (companyDataArray.length < 17) {
    throw new Error("Información no disponible");
  }
  return sociedad;
}
