'use strict';

// catalog/doctypes.json
var doctypes_default = {
  "carton-ds1": {
    label: "Cart\xF3n DS1",
    shortLabel: "DS1",
    source: "MINVU",
    category: "personal",
    definition: "Certificado MINVU de subsidio habitacional Decreto Supremo 1.",
    classifier: {
      useWhen: [
        "certificado de subsidio habitacional DS1"
      ],
      signals: [
        "membrete MINVU + texto 'Decreto Supremo 1' / 'DS1' / 'subsidio habitacional'"
      ],
      rejectWhen: [],
      tieBreaker: [
        {
          vs: "avaluo-fiscal",
          rule: "DS1 = membrete MINVU + subsidio; aval\xFAo = logo SII + t\xEDtulo 'CERTIFICADO DE AVAL\xDAO FISCAL' + ROL"
        },
        {
          vs: "compraventa-propiedad",
          rule: "DS1 = certificado de una p\xE1gina; compraventa = escritura notarial larga con cl\xE1usulas"
        }
      ]
    },
    fields: [
      {
        key: "beneficiario",
        type: "string",
        internal: true
      },
      {
        key: "estado_civil",
        type: "string",
        internal: true
      },
      {
        key: "monto_subsidio",
        type: "num",
        internal: true
      },
      {
        key: "formula_calculo",
        type: "string",
        internal: true
      }
    ]
  },
  "cedula-identidad": {
    label: "C\xE9dula de Identidad",
    shortLabel: "Carnet",
    source: "Registro Civil",
    category: "personal",
    freq: "once",
    count: 1,
    parts: [
      "Frente",
      "Rev\xE9s"
    ],
    extractScope: "firstPage",
    definition: "C\xE9dula de Identidad chilena del Registro Civil \u2014 tarjeta plastificada con foto.",
    classifier: {
      useWhen: [
        "tarjeta pl\xE1stica de identidad chilena, frente y/o reverso"
      ],
      signals: [
        "frente: r\xF3tulo 'C\xC9DULA DE IDENTIDAD', foto, bandera chilena, 'RUN ...' abajo a la izquierda",
        "reverso: huella dactilar, c\xF3digo QR, l\xEDneas MRZ 'IDCHL...'"
      ],
      rejectWhen: [
        "es pasaporte, licencia de conducir u otra credencial"
      ],
      tieBreaker: []
    },
    dateHint: "Usa la fecha de emisi\xF3n de la c\xE9dula. Debe coincidir con el campo `fecha_emision`. De las m\xFAltiples fechas impresas (nacimiento, emisi\xF3n, vencimiento) es la INTERMEDIA cronol\xF3gicamente: posterior a fecha de nacimiento y anterior a fecha de vencimiento. Etiqueta t\xEDpica: 'FECHA DE EMISI\xD3N' o 'EMISI\xD3N'. Si no la encuentras etiquetada pero ves una fecha de vencimiento, la emisi\xF3n es 4 a\xF1os antes (c\xE9dulas chilenas y de residentes extranjeros tienen validez de 4 a\xF1os).",
    fields: [
      {
        key: "rut",
        type: "string",
        ai: "RUN chileno impreso al pie de la c\xE9dula como 'RUN 26.621.198-8' (frente) y tambi\xE9n en la \xFAltima l\xEDnea del MRZ del reverso (ej. 'VEN26621198<8<0' \u2192 26621198-8). Formato XX.XXX.XXX-X o XX.XXX.XXX-K. El d\xEDgito verificador al final puede ser 0-9 o K, NUNCA 'B' (si lees 'B' es un '8' mal reconocido). No lo confundas con 'N\xDAMERO DOCUMENTO' (otro campo distinto) ni con la fecha de nacimiento del MRZ. Si aparece en ambos lados, c\xF3pialo del frente."
      },
      {
        key: "nombres",
        type: "string"
      },
      {
        key: "apellidos",
        type: "string"
      },
      {
        key: "nacionalidad",
        type: "string",
        ai: "Valor literal del campo 'NACIONALIDAD' en el frente de la c\xE9dula. En c\xE9dulas de extranjeros es el c\xF3digo ISO de 3 letras del pa\xEDs de origen (VEN, PER, COL, ARG, BOL, ECU, HTI, CHN, etc.). En c\xE9dulas chilenas es 'CHILENA' o 'CHL'. NUNCA devuelvas 'EXTRANJERO' \u2014 esa palabra es el tipo de c\xE9dula (t\xEDtulo en el encabezado), no la nacionalidad."
      },
      {
        key: "sexo",
        type: "string",
        internal: true,
        ai: "Una sola letra: 'M' (masculino) o 'F' (femenino). Nunca devuelvas el c\xF3digo de nacionalidad ni otro valor \u2014 si no lees claramente M o F, devuelve null."
      },
      {
        key: "fecha_nacimiento",
        type: "date"
      },
      {
        key: "numero_documento",
        type: "string",
        internal: true,
        ai: "N\xFAmero del documento de origen impreso en el frente como 'N\xDAMERO DOCUMENTO' (ej. '603.113.124'). Solo en c\xE9dulas de extranjeros. NO es el RUN, NO es el MRZ del reverso. Si no existe el campo, devuelve null."
      },
      {
        key: "fecha_emision",
        type: "date",
        internal: true
      },
      {
        key: "fecha_vencimiento",
        type: "date",
        internal: true
      },
      {
        key: "lugar_nacimiento",
        type: "string",
        internal: true,
        ai: "Texto tal cual aparece despu\xE9s de 'Naci\xF3 en:' en el reverso de la c\xE9dula. C\xF3pialo literal sin interpretar \u2014 puede ser una sola palabra (comuna), o varios t\xE9rminos separados por coma (barrio/localidad, comuna). Ejemplos v\xE1lidos: 'PUENTE ALTO', 'FRANKLIN, SANTIAGO', 'ISLUGA, COLCHANE'"
      },
      {
        key: "profesion",
        type: "string",
        internal: true
      }
    ],
    howToObtain: {
      steps: [
        "Toma una foto clara de tu c\xE9dula de identidad por ambos lados",
        "Aseg\xFArate que se vean todos los datos sin reflejos",
        "Sube el <b>frente</b> y el <b>rev\xE9s</b> por separado"
      ],
      tips: [
        "Usa buena iluminaci\xF3n para evitar sombras",
        "Coloca la c\xE9dula sobre un fondo oscuro para mejor contraste"
      ]
    }
  },
  "cert-nacimiento-hijo": {
    label: "Cert. de Nacimiento (Hijo)",
    shortLabel: "Nacimiento",
    source: "Registro Civil",
    category: "personal",
    multiInstance: true,
    definition: "Certificado de Nacimiento del Registro Civil chileno.",
    classifier: {
      useWhen: [
        "hoja de certificado Registro Civil que acredita un nacimiento"
      ],
      signals: [
        "t\xEDtulo naranjo 'CERTIFICADO DE NACIMIENTO' + plantilla Registro Civil (escudo, marco naranjo, FOLIO, timbre electr\xF3nico)"
      ],
      rejectWhen: [],
      tieBreaker: [
        {
          vs: "certificado-matrimonio",
          rule: "misma plantilla Registro Civil \u2014 nacimiento = un inscrito + padres; matrimonio = dos c\xF3nyuges"
        },
        {
          vs: "padron",
          rule: "misma plantilla Registro Civil \u2014 nacimiento tiene datos de persona; padr\xF3n tiene 'DATOS DEL VEHICULO' (marca, motor, chasis)"
        }
      ]
    },
    fields: [
      {
        key: "folio",
        type: "string",
        internal: true
      },
      {
        key: "codigo_verificacion",
        type: "string",
        internal: true
      },
      {
        key: "circunscripcion",
        type: "string",
        internal: true
      },
      {
        key: "numero_inscripcion",
        type: "string",
        internal: true
      },
      {
        key: "a\xF1o_registro",
        type: "string",
        internal: true
      },
      {
        key: "nombre",
        type: "string",
        internal: true
      },
      {
        key: "rut",
        type: "string",
        internal: true
      },
      {
        key: "fecha_nacimiento",
        type: "date",
        internal: true
      },
      {
        key: "hora_nacimiento",
        type: "time",
        internal: true
      },
      {
        key: "sexo",
        type: "string",
        internal: true
      },
      {
        key: "padre.nombre",
        type: "string"
      },
      {
        key: "padre.rut",
        type: "string"
      },
      {
        key: "madre.nombre",
        type: "string"
      },
      {
        key: "madre.rut",
        type: "string"
      },
      {
        key: "fecha_emision",
        type: "date",
        internal: true
      }
    ],
    howToObtain: {
      steps: [
        "Ingresa a <a href='https://www.registrocivil.cl' target='_blank' rel='noopener'>www.registrocivil.cl</a>",
        "Haz clic en <b>Obtener Certificados</b>",
        "Selecciona <b>Certificado de Nacimiento</b>",
        "Inicia sesi\xF3n con tu Clave\xDAnica",
        "Descarga el certificado en formato PDF"
      ],
      tips: [
        "El certificado tiene validez de 60 d\xEDas",
        "Puedes obtener hasta 3 certificados gratis por a\xF1o"
      ]
    }
  },
  "certificado-antiguedad": {
    label: "Cert. Antig\xFCedad Laboral",
    shortLabel: "Antig\xFCedad",
    disambiguator: "empleador",
    source: "Empleador",
    category: "personal",
    freq: "once",
    count: 1,
    multiInstance: true,
    definition: "Certificado del empleador que acredita la antig\xFCedad laboral de un trabajador.",
    classifier: {
      useWhen: [
        "carta/certificado donde el empleador acredita tiempo de servicio de un trabajador"
      ],
      signals: [
        "texto tipo 'certifica que ... se desempe\xF1a desde [fecha] ... en el cargo de ...' + firma del empleador"
      ],
      rejectWhen: [],
      tieBreaker: [
        {
          vs: "liquidaciones-sueldo",
          rule: "antig\xFCedad = carta breve sin tabla; liquidaci\xF3n = tabla HABERES/DESCUENTOS de un mes con LIQUIDO A PERCIBIR"
        }
      ]
    },
    fields: [
      {
        key: "empleador",
        type: "string"
      },
      {
        key: "rut_empleador",
        type: "string",
        internal: true
      },
      {
        key: "empleado",
        type: "string",
        internal: true
      },
      {
        key: "rut",
        type: "string",
        internal: true
      },
      {
        key: "cargo",
        type: "string",
        ai: "Cargo o funci\xF3n del trabajador. En instituciones militares puede aparecer como rango/grado antes del nombre (ej: CAP.=Capit\xE1n, SGT.=Sargento, TTE.=Teniente). Extrae el cargo completo."
      },
      {
        key: "fecha_ingreso",
        type: "date"
      },
      {
        key: "antiguedad",
        type: "string"
      },
      {
        key: "renta",
        type: "num",
        ai: "Extrae la remuneraci\xF3n o renta mensual si est\xE1 indicada en el documento. Puede aparecer como sueldo, remuneraci\xF3n, renta bruta o l\xEDquida. Valor num\xE9rico entero en pesos sin separador de miles. Si no se menciona, omitir."
      }
    ]
  },
  "certificado-matrimonio": {
    label: "Cert. de Matrimonio",
    shortLabel: "Matrimonio",
    source: "Registro Civil",
    category: "personal",
    freq: "once",
    count: 1,
    definition: "Certificado de Matrimonio del Registro Civil chileno.",
    classifier: {
      useWhen: [
        "hoja de certificado Registro Civil que acredita un matrimonio"
      ],
      signals: [
        "t\xEDtulo naranjo 'CERTIFICADO DE MATRIMONIO' + plantilla Registro Civil (escudo, marco naranjo, FOLIO, timbre electr\xF3nico)"
      ],
      rejectWhen: [],
      tieBreaker: [
        {
          vs: "cert-nacimiento-hijo",
          rule: "misma plantilla Registro Civil \u2014 matrimonio = dos c\xF3nyuges; nacimiento = un inscrito + padres"
        },
        {
          vs: "certificado-no-matrimonio",
          rule: "t\xEDtulo 'CERTIFICADO DE MATRIMONIO' con dos c\xF3nyuges; no-matrimonio dice 'NO MATRIMONIO' / solter\xEDa con una sola persona"
        }
      ]
    },
    fields: [
      {
        key: "folio",
        type: "string",
        internal: true
      },
      {
        key: "codigo_verificacion",
        type: "string",
        internal: true
      },
      {
        key: "circunscripcion",
        type: "string",
        internal: true
      },
      {
        key: "numero_inscripcion",
        type: "string",
        internal: true
      },
      {
        key: "a\xF1o_registro",
        type: "num",
        internal: true
      },
      {
        key: "marido.nombre",
        type: "string",
        internal: true
      },
      {
        key: "marido.rut",
        type: "string",
        internal: true
      },
      {
        key: "marido.fecha_nacimiento",
        type: "date",
        internal: true
      },
      {
        key: "mujer.nombre",
        type: "string",
        internal: true
      },
      {
        key: "mujer.rut",
        type: "string",
        internal: true
      },
      {
        key: "mujer.fecha_nacimiento",
        type: "date",
        internal: true
      },
      {
        key: "fecha_celebracion",
        type: "date",
        internal: true
      },
      {
        key: "hora_celebracion",
        type: "time",
        internal: true
      },
      {
        key: "regimen_patrimonial",
        type: "string",
        internal: true
      },
      {
        key: "fecha_emision",
        type: "date",
        internal: true
      }
    ],
    howToObtain: {
      steps: [
        "Ingresa a <a href='https://www.registrocivil.cl' target='_blank' rel='noopener'>www.registrocivil.cl</a>",
        "Haz clic en <b>Obtener Certificados</b>",
        "Selecciona <b>Certificado de Matrimonio</b>",
        "Inicia sesi\xF3n con tu Clave\xDAnica",
        "Descarga el certificado en formato PDF"
      ],
      tips: [
        "El certificado tiene validez de 60 d\xEDas"
      ]
    }
  },
  "certificado-no-matrimonio": {
    label: "Cert. No-Matrimonio",
    shortLabel: "NoMatrimonio",
    source: "Registro Civil",
    category: "personal",
    freq: "once",
    count: 1,
    definition: "Certificado de Solter\xEDa / No-Matrimonio del Registro Civil chileno.",
    classifier: {
      useWhen: [
        "hoja de certificado Registro Civil que acredita ausencia de matrimonio vigente"
      ],
      signals: [
        "t\xEDtulo naranjo con 'NO MATRIMONIO' / 'SOLTER\xCDA' + plantilla Registro Civil; solo nombre y R.U.N. de una persona, sin c\xF3nyuge"
      ],
      rejectWhen: [],
      tieBreaker: [
        {
          vs: "certificado-matrimonio",
          rule: "t\xEDtulo 'CERTIFICADO DE MATRIMONIO' con dos c\xF3nyuges; no-matrimonio dice 'NO MATRIMONIO' / solter\xEDa con una sola persona"
        }
      ]
    },
    fields: [
      {
        key: "rut",
        type: "string",
        internal: true
      },
      {
        key: "nombre",
        type: "string",
        internal: true
      }
    ]
  },
  "cotizaciones-afp": {
    label: "Cotizaciones AFP",
    shortLabel: "AFP",
    source: "AFP o Previred",
    category: "ingresos",
    freq: "once",
    count: 1,
    definition: "Certificado de cotizaciones previsionales AFP (emitido por AFP o Previred).",
    classifier: {
      useWhen: [
        "certificado con la tabla hist\xF3rica de per\xEDodos cotizados en AFP"
      ],
      signals: [
        "logo de la AFP (Modelo, Habitat, Cuprum, Capital, Planvital, Provida) o de Previred",
        "t\xEDtulo 'CERTIFICADO COTIZACIONES' / 'CERTIFICADO DE COTIZACIONES' + tabla mensual (Per\xEDodo / Monto / Rut Pagador)"
      ],
      rejectWhen: [],
      tieBreaker: [
        {
          vs: "liquidaciones-sueldo",
          rule: "cotizaciones-afp = t\xEDtulo 'CERTIFICADO COTIZACIONES' + tabla de muchos meses; liquidaci\xF3n = un mes con HABERES/DESCUENTOS"
        }
      ]
    },
    dateHint: "Usa el per\xEDodo M\xC1S RECIENTE de la tabla de cotizaciones (ej: \xFAltima fila es 12-2025 \u2192 2025-12-01), NO la fecha de emisi\xF3n del certificado",
    fields: [
      {
        key: "afp",
        type: "string",
        internal: true
      },
      {
        key: "nombre",
        type: "string",
        internal: true
      },
      {
        key: "rut",
        type: "string",
        internal: true
      },
      {
        key: "periodo_desde",
        type: "string",
        internal: true
      },
      {
        key: "periodo_hasta",
        type: "string",
        internal: true
      },
      {
        key: "folio_certificacion",
        type: "string",
        internal: true
      },
      {
        key: "codigo_validador",
        type: "string",
        internal: true
      },
      {
        key: "meses_laguna",
        type: "number",
        ai: "Cuenta los meses dentro del rango cubierto (periodo_desde a periodo_hasta inclusive) donde NO aparece ninguna cotizaci\xF3n de empleador. No cuentes como laguna los meses con cotizaci\xF3n independiente (COT. NORMAL AFIL. INDEPENDIENTE). Devuelve un n\xFAmero entero.",
        internal: true
      },
      {
        key: "lagunas_largas",
        type: "number",
        ai: "Cuenta cu\xE1ntas secuencias de meses consecutivos sin cotizaci\xF3n de empleador tienen M\xC1S de 2 meses seguidos. Ejemplo: una brecha de 3 meses = 1 laguna larga; dos brechas de 3 meses separadas = 2 lagunas largas. Devuelve un n\xFAmero entero.",
        internal: true
      },
      {
        key: "empleador_anterior",
        type: "number",
        ai: "Si la tabla contiene m\xE1s de un RUT pagador distinto, calcula cu\xE1ntos meses han pasado desde la \xFAltima cotizaci\xF3n del empleador anterior (el que pag\xF3 antes del empleador actual). Por ejemplo: si el empleador anterior pag\xF3 por \xFAltima vez en 08-2024 y el per\xEDodo m\xE1s reciente del documento es 12-2025, devuelve 16. Si todos los per\xEDodos tienen el mismo RUT pagador, devuelve null.",
        internal: true
      },
      {
        key: "cotizaciones",
        type: "list",
        ai: 'Extrae TODAS las filas de la tabla de cotizaciones como array. Cada entrada tiene: periodo (formato MM-YYYY), tipo ("normal" si es COTIZACION NORMAL pagada por empleador, "independiente" si es COT. NORMAL AFIL. INDEPENDIENTE pagada por el afiliado), monto (monto en pesos como n\xFAmero entero sin separadores), rut_pagador (RUT del pagador). Si un per\xEDodo tiene m\xFAltiples entradas (ej: normal + independiente), incluye ambas como filas separadas.',
        internal: true
      }
    ],
    howToObtain: {
      steps: [
        "Ingresa a <a href='https://www.previred.com' target='_blank' rel='noopener'>www.previred.com</a>",
        "Haz clic en <b>Trabajador</b> y luego <b>Certificados</b>",
        "Inicia sesi\xF3n con tu Clave\xDAnica",
        "Selecciona el per\xEDodo requerido",
        "Descarga el certificado en formato PDF"
      ],
      tips: [
        "El certificado muestra las \xFAltimas 12 cotizaciones",
        "Puedes filtrar por empleador si tienes varios"
      ]
    }
  },
  "liquidaciones-sueldo": {
    label: "Liquidaciones de Sueldo",
    shortLabel: "LiqSueldo",
    disambiguator: "empleador",
    source: "Empleador",
    category: "ingresos",
    freq: "monthly",
    count: 6,
    pageAtomic: true,
    extractScope: "firstPage",
    graceDays: 10,
    definition: "Liquidaci\xF3n de sueldo mensual de un trabajador dependiente, emitida por el empleador.",
    classifier: {
      useWhen: [
        "documento mensual de remuneraci\xF3n de un trabajador dependiente"
      ],
      signals: [
        "t\xEDtulo 'LIQUIDACION DE REMUNERACIONES' / 'LIQUIDACI\xD3N DE SUELDO' + etiqueta de mes-a\xF1o",
        "layout de dos columnas 'HABERES' y 'DESCUENTOS' con fila 'LIQUIDO A PERCIBIR'"
      ],
      rejectWhen: [],
      tieBreaker: [
        {
          vs: "certificado-antiguedad",
          rule: "liquidaci\xF3n = tabla HABERES/DESCUENTOS del mes; antig\xFCedad = carta breve que certifica tiempo de servicio"
        },
        {
          vs: "cotizaciones-afp",
          rule: "liquidaci\xF3n = un mes; cotizaciones-afp = t\xEDtulo 'CERTIFICADO COTIZACIONES' + tabla hist\xF3rica de muchos meses"
        }
      ]
    },
    dateHint: "Usa el mes/a\xF1o del PER\xCDODO de la liquidaci\xF3n (ej: 'Per\xEDodo: Junio 2025' \u2192 2025-06-01), NO la fecha de emisi\xF3n, fecha de pago ni fecha de dep\xF3sito",
    fields: [
      {
        key: "empleador",
        type: "string",
        ai: "Extrae el nombre de la empresa empleadora tal como aparece en el encabezado o membrete del documento. No es el nombre del trabajador.",
        internal: true
      },
      {
        key: "nombre",
        type: "string",
        internal: true
      },
      {
        key: "rut",
        type: "string",
        internal: true
      },
      {
        key: "periodo",
        type: "month",
        internal: true
      },
      {
        key: "dias_trabajados",
        type: "num",
        internal: true
      },
      {
        key: "fecha_ingreso",
        type: "date",
        internal: true
      },
      {
        key: "cargo",
        type: "string",
        internal: true
      },
      {
        key: "institucion_previsional",
        type: "string",
        internal: true
      },
      {
        key: "institucion_salud",
        type: "string",
        internal: true
      },
      {
        key: "base_imponible",
        type: "num",
        internal: true
      },
      {
        key: "base_tributable",
        type: "num",
        ai: "Base sobre la cual se calcula el Impuesto \xDAnico de Segunda Categor\xEDa. Si la liquidaci\xF3n imprime una l\xEDnea expl\xEDcita 'Base Tributable' o 'Total Tributable', \xFAsala. Si no aparece esa l\xEDnea expl\xEDcita, devuelve EL MISMO VALOR que base_imponible. NUNCA devuelvas null y NUNCA restes los descuentos previsionales \u2014 el c\xE1lculo legal lo hace el sistema downstream.",
        internal: true
      },
      {
        key: "haberes",
        type: "list",
        ai: "Extrae SOLO las filas AT\xD3MICAS de haberes/ingresos como array de {label, value}. Incluye haberes imponibles Y no imponibles (colaci\xF3n, movilizaci\xF3n). Usa el nombre exacto del documento (ej: 'Sueldo Base', 'Gratificaci\xF3n Legal', 'Bono Responsabilidad', 'Horas Extras', 'Colaci\xF3n', 'Movilizaci\xF3n'). value es el monto num\xE9rico entero (sin separador de miles). NUNCA incluyas filas de total/subtotal/control/agregado/base de c\xE1lculo. Ejemplos PROHIBIDOS: 'Total Imponible', 'Total No Imponible', 'Total Haberes', 'Sub Total', 'Base Imponible', 'Base Tributable', 'Total Imponibles', 'Total No Imponibles', 'Total Bruto', 'L\xEDquido a Pagar', 'Alcance L\xEDquido', 'Sueldo L\xEDquido', 'Total a Pagar'. Si una fila resume otras filas ya extra\xEDdas, OM\xCDTELA \u2014 el sistema downstream calcula totales por s\xED mismo.",
        internal: true
      },
      {
        key: "descuentos",
        type: "list",
        ai: "Extrae SOLO las filas AT\xD3MICAS de descuentos como array de {label, value}. Incluye AFP, salud, cesant\xEDa, impuesto \xFAnico, anticipos, cuotas, pr\xE9stamos, seguros voluntarios, etc. Usa el nombre exacto del documento. value es el monto num\xE9rico entero (sin separador de miles). NUNCA incluyas filas de total/subtotal/control/agregado. Ejemplos PROHIBIDOS: 'Total Leyes Soc.', 'Total Descuentos', 'Total Descuentos Legales', 'Descuentos Legales', 'Descto. Legales', 'Total Otros Descuentos', 'Total Imposiciones', 'Suma Descuentos', 'Total Descuentos Voluntarios'. Si una fila resume AFP+salud+cesant\xEDa o cualquier otro grupo de descuentos ya extra\xEDdos como filas separadas, OM\xCDTELA \u2014 el sistema downstream suma por s\xED mismo.",
        internal: true
      }
    ],
    normalize: {
      "haberes[].label": {
        stripParametric: true
      },
      "descuentos[].label": {
        stripParametric: true
      }
    },
    howToObtain: {
      steps: [
        "Solicita tu liquidaci\xF3n a tu empleador o al \xE1rea de RRHH",
        "Si tu empresa usa portal de empleados, desc\xE1rgala desde ah\xED",
        "Aseg\xFArate que muestre: nombre, RUT, sueldo bruto, descuentos y l\xEDquido"
      ],
      tips: [
        "Las liquidaciones deben ser de los \xFAltimos 3-6 meses seg\xFAn se solicite",
        "Si no tienes acceso digital, toma una foto clara del documento"
      ]
    }
  },
  "resumen-boletas-sii": {
    label: "Boletas Honorarios Anual",
    shortLabel: "Boletas",
    source: "SII",
    category: "ingresos",
    freq: "annual",
    count: 2,
    graceDays: 90,
    definition: "Resumen anual SII de boletas de honorarios emitidas o recibidas por un contribuyente.",
    classifier: {
      useWhen: [
        "documento cuyo contenido visible son tablas de boletas de honorarios (BHE/BTE) por per\xEDodo"
      ],
      signals: [
        "t\xEDtulo 'INFORME ANUAL DE BOLETAS DE HONORARIOS ELECTRONICAS'",
        "chrome de p\xE1gina web SII (logo SII, barra 'Mi SII / Servicios online', URL pie loa.sii.cl)",
        "tabla con columnas 'PERIODOS / FOLIOS / EMISIONES / HONORARIO BRUTO / RETENCI\xD3N / TOTAL L\xCDQUIDO'",
        "clasificar aunque la tabla est\xE9 vac\xEDa o diga 'No registra informaci\xF3n'"
      ],
      rejectWhen: [
        "tiene el encabezado F22 ('IMPUESTOS ANUALES A LA RENTA' / 'FORM. 22')"
      ],
      tieBreaker: [
        {
          vs: "carpeta-tributaria",
          rule: "una p\xE1gina suelta con la tabla de boletas es resumen-boletas; la carpeta completa tiene portada 'CARPETA TRIBUTARIA' + 'P\xE1g. X / 12'"
        },
        {
          vs: "declaracion-anual-impuestos",
          rule: "resumen-boletas = tabla BHE/BTE, sin encabezado F22; DAI = t\xEDtulo 'IMPUESTOS ANUALES A LA RENTA' + c\xF3digos en recuadros"
        }
      ]
    },
    dateHint: "Usa el A\xD1O TRIBUTARIO del resumen, NO la fecha de consulta o descarga. Ejemplos: 'INFORME CORRESPONDIENTE AL A\xD1O 2024' \u2192 2024-01-01; 'resumen del a\xF1o 2024' \u2192 2024-01-01.",
    fields: [
      {
        key: "rut",
        type: "string",
        internal: true
      },
      {
        key: "contribuyente",
        type: "string",
        internal: true
      },
      {
        key: "a\xF1o",
        type: "num",
        internal: true
      },
      {
        key: "totales.boletas_vigentes",
        type: "num",
        internal: true
      },
      {
        key: "totales.boletas_anuladas",
        type: "num",
        internal: true
      },
      {
        key: "totales.honorario_bruto",
        type: "num",
        internal: true
      },
      {
        key: "totales.retencion_terceros",
        type: "num",
        internal: true
      },
      {
        key: "totales.retencion_contribuyente",
        type: "num",
        internal: true
      },
      {
        key: "totales.total_liquido",
        type: "num"
      },
      {
        key: "meses",
        type: "obj",
        ai: "Extrae el desglose mensual como objeto donde cada clave es el mes (enero, febrero, etc.) con boletas_vigentes, honorario_bruto, retencion y liquido",
        internal: true
      }
    ],
    howToObtain: {
      steps: [
        "Ingresa a <a href='https://www.sii.cl' target='_blank' rel='noopener'>www.sii.cl</a>",
        "Haz clic en <b>Servicios Online</b>",
        "Selecciona <b>Boletas de honorarios electr\xF3nicas</b>",
        "Entra a <b>Emisor de boleta de honorarios</b>",
        "Ve a <b>Consultas sobre boletas de honorarios electr\xF3nicas</b>",
        "Haz clic en <b>Consultar boletas emitidas</b>",
        "Selecciona por mes o selecciona todo el a\xF1o para obtener el informe anual"
      ],
      tips: [
        "Para el informe anual, selecciona el a\xF1o completo en lugar de mes a mes",
        "Descarga el resumen en PDF para subirlo"
      ]
    }
  },
  "balance-anual": {
    label: "Balance Anual",
    shortLabel: "Balance",
    source: "SII",
    category: "tributario",
    freq: "annual",
    count: 2,
    graceDays: 90,
    definition: "Balance tributario anual simple descargado del SII (sii.cl).",
    classifier: {
      useWhen: [
        "resumen tributario anual simple de ingresos y egresos descargado del SII"
      ],
      signals: [
        "logo SII / chrome sii.cl + tabla simple de ingresos y egresos por a\xF1o tributario (sin 8 columnas contables)"
      ],
      rejectWhen: [],
      tieBreaker: [
        {
          vs: "balance-general",
          rule: "balance-anual = tabla simple del SII; balance-general = banner azul 'Balance general' + 8 columnas contables + cuentas numeradas"
        }
      ]
    },
    dateHint: "Usa el A\xD1O CONTABLE del balance (ej: balance 2024 \u2192 2024-01-01), NO la fecha de emisi\xF3n o firma",
    fields: [
      {
        key: "empresa",
        type: "string",
        internal: true
      },
      {
        key: "year",
        type: "string",
        internal: true
      },
      {
        key: "ingresos",
        type: "num",
        internal: true
      },
      {
        key: "egresos",
        type: "num",
        internal: true
      }
    ]
  },
  "declaracion-anual-impuestos": {
    label: "Decl. Anual Impuestos DAI",
    shortLabel: "DAI",
    source: "SII",
    category: "tributario",
    freq: "annual",
    count: 2,
    graceDays: 90,
    definition: "Formulario 22 del SII \u2014 Declaraci\xF3n Anual de Impuestos a la Renta.",
    classifier: {
      useWhen: [
        "formulario oficial SII que declara las rentas e impuestos de un a\xF1o tributario"
      ],
      signals: [
        "bloque de encabezado arriba-izquierda 'REPUBLICA DE CHILE / SERVICIO DE IMPUESTOS INTERNOS FORM. 22'",
        "t\xEDtulo centrado 'A\xD1O TRIBUTARIO YYYY' + 'IMPUESTOS ANUALES A LA RENTA', folio '07 N\xB0 ...' arriba-derecha",
        "cuadr\xEDcula de campos, cada uno con un c\xF3digo num\xE9rico en recuadro naranja/salm\xF3n (15, 53, 110, 158...)"
      ],
      rejectWhen: [
        "p\xE1ginas de boletas de honorarios, Formulario 29, tablas mensuales de IVA",
        "extracto o p\xE1gina SII sin el encabezado FORM. 22"
      ],
      tieBreaker: [
        {
          vs: "carpeta-tributaria",
          rule: "DAI = un F22 suelto; la carpeta es el paquete con portada 'CARPETA TRIBUTARIA' + 'P\xE1g. X / 12' (puede contener un F22 adentro)"
        },
        {
          vs: "resumen-boletas-sii",
          rule: "DAI = encabezado 'FORM. 22' + c\xF3digos en recuadros; resumen-boletas = tabla BHE/BTE sin ese encabezado"
        }
      ]
    },
    dateHint: "Usa el A\xD1O TRIBUTARIO del formulario (ej: 'A\xF1o Tributario 2024' \u2192 2024-01-01), NO la fecha de presentaci\xF3n",
    display_codes: [
      "547",
      "110",
      "104",
      "105",
      "161",
      "170"
    ],
    fields: [
      {
        key: "rut",
        type: "string",
        internal: true
      },
      {
        key: "nombre",
        type: "string",
        internal: true
      },
      {
        key: "a\xF1o_tributario",
        type: "num",
        ai: "A\xF1o tributario del formulario (ej: 2024). Aparece en el encabezado como 'A\xD1O TRIBUTARIO 2024'",
        internal: true
      },
      {
        key: "codes",
        type: "object",
        ai: 'Extrae los valores num\xE9ricos de los siguientes c\xF3digos F22. Los c\xF3digos aparecen dentro de recuadros (cuadros) de color naranja o salm\xF3n a la izquierda de cada fila del formulario. Busca cada c\xF3digo y devuelve su valor como n\xFAmero entero, o null si el c\xF3digo no aparece en el documento. C\xF3digos a extraer: 547 (Total Ingresos Brutos, Recuadro N\xB01), 110 (Honorarios y rem. directores S.A., art. 42 N\xB02 y 48), 104 (Retiros o remesas afectos al IGC o IA), 105 (Dividendos afectos al IGC o IA), 155 (Rentas de capitales mobiliarios, art. 20 N\xB02), 161 (Sueldos, pensiones y otras rentas similares, art. 42 N\xB01), 170 (Base Imponible Anual de IUSC o IGC), 305 (Resultado Liquidaci\xF3n Anual Impuesto a la Renta \u2014 puede ser negativo). Devuelve: { "547": valor_o_null, "110": valor_o_null, ... }'
      }
    ],
    howToObtain: {
      steps: [
        "Ingresa a <a href='https://www.sii.cl' target='_blank' rel='noopener'>www.sii.cl</a>",
        "Haz clic en <b>Servicios Online</b> \u2192 <b>Declaraci\xF3n de Renta</b>",
        "Inicia sesi\xF3n con tu Clave\xDAnica o Clave SII",
        "Selecciona <b>Consulta y Seguimiento</b> \u2192 <b>Consultar Estado de Declaraci\xF3n</b>",
        "Selecciona el a\xF1o tributario y descarga el PDF (Formulario 22 Compacto)"
      ],
      tips: [
        "El F22 corresponde a las rentas del a\xF1o anterior al tributario (ej: AT 2024 = rentas de 2023)",
        "Tambi\xE9n se puede obtener desde la Carpeta Tributaria, pero este documento es la declaraci\xF3n individual"
      ]
    }
  },
  "balance-general": {
    label: "Balance General",
    shortLabel: "Balance Gral",
    source: "Contador / Empresa",
    category: "tributario",
    freq: "annual",
    count: 1,
    graceDays: 90,
    multiInstance: true,
    definition: "Balance General de 8 columnas preparado por el contador de la empresa.",
    classifier: {
      useWhen: [
        "planilla contable de 8 columnas de una empresa preparada por el contador"
      ],
      signals: [
        "banner/t\xEDtulo 'Balance general' + tabla ancha de 8 columnas contables + cuentas numeradas (1101-10, 2105-02...)"
      ],
      rejectWhen: [
        "estados financieros auditados IFRS/NIIF"
      ],
      tieBreaker: [
        {
          vs: "balance-anual",
          rule: "balance-general = 8 columnas contables + cuentas numeradas; balance-anual = tabla simple del SII"
        }
      ]
    },
    dateHint: "Usa el per\xEDodo final del balance (ej: 'De Enero 2024 a Diciembre 2024' \u2192 2024-12-01)",
    fields: [
      {
        key: "empresa",
        type: "string",
        internal: true,
        ai: "Raz\xF3n social de la empresa tal como aparece en el encabezado del balance"
      },
      {
        key: "rut",
        type: "string",
        internal: true,
        ai: "RUT de la empresa (con gui\xF3n y d\xEDgito verificador, sin puntos)"
      },
      {
        key: "periodo",
        type: "string",
        internal: true,
        ai: "Per\xEDodo del balance tal como aparece (ej: 'Enero 2024 a Diciembre 2024')"
      },
      {
        key: "from_date",
        type: "date",
        internal: true,
        ai: "Fecha de inicio del per\xEDodo del balance en formato YYYY-MM-DD (ej: si dice 'De Enero 2024' \u2192 2024-01-01)"
      },
      {
        key: "to_date",
        type: "date",
        internal: true,
        ai: "Fecha de t\xE9rmino del per\xEDodo del balance en formato YYYY-MM-DD (ej: si dice 'a Diciembre 2024' \u2192 2024-12-01)"
      },
      {
        key: "total_activos",
        type: "num",
        internal: true,
        ai: "Total Inventario Activo (\xFAltima fila, columna 'Inventario activo'). Usar el valor final ajustado (despu\xE9s de p\xE9rdida/utilidad)"
      },
      {
        key: "total_pasivos",
        type: "num",
        internal: true,
        ai: "Total Inventario Pasivo (\xFAltima fila, columna 'Inventario pasivo'). Usar el valor final ajustado"
      },
      {
        key: "patrimonio",
        type: "num",
        internal: true,
        ai: "Suma de cuentas de patrimonio (cuentas 23xx): Capital + Revalorizaci\xF3n Capital Propio + P\xE9rdidas y Ganancias acumuladas, de la columna 'Inventario pasivo' o 'Saldos acreedores'"
      },
      {
        key: "total_ingresos",
        type: "num",
        internal: true,
        ai: "Total Resultado Ganancias (\xFAltima fila antes del ajuste, columna 'Resultado ganancias')"
      },
      {
        key: "total_gastos",
        type: "num",
        internal: true,
        ai: "Total Resultado P\xE9rdidas (\xFAltima fila antes del ajuste, columna 'Resultado p\xE9rdidas')"
      },
      {
        key: "resultado",
        type: "num",
        internal: true,
        ai: "Resultado del ejercicio: ganancias - p\xE9rdidas. Positivo = utilidad, negativo = p\xE9rdida. Ej: si Ganancias=1.543.777 y P\xE9rdidas=4.610.482 \u2192 resultado = -3.066.705"
      }
    ]
  },
  "carpeta-tributaria": {
    label: "Carpeta Tributaria",
    shortLabel: "Carpeta",
    source: "SII",
    category: "tributario",
    freq: "once",
    count: 1,
    contains: [
      "declaracion-anual-impuestos",
      "resumen-boletas-sii"
    ],
    definition: "Carpeta Tributaria Electr\xF3nica del SII \u2014 contenedor PDF de Carpeta solo cuando la carga incluye portada/t\xEDtulo 'CARPETA TRIBUTARIA' o varias p\xE1ginas consecutivas del paquete; una p\xE1gina interior suelta nunca es este doctype.",
    classifier: {
      useWhen: [
        "la carga es la Carpeta como contenedor: PDF de 2 o m\xE1s p\xE1ginas del SII con portada/t\xEDtulo/encabezado visible 'CARPETA TRIBUTARIA' o con varias p\xE1ginas consecutivas del mismo paquete"
      ],
      signals: [
        "portada o encabezado visible con t\xEDtulo 'CARPETA TRIBUTARIA REGULAR PERSONALIZADA' / 'CARPETA TRIBUTARIA ELECTR\xD3NICA' + logo SII",
        "PDF de 2 o m\xE1s p\xE1ginas con m\xFAltiples secciones distintas de la Carpeta en p\xE1ginas consecutivas; los nombres Datos del Contribuyente, Actividades Econ\xF3micas, Socios, Propiedades y Bienes Ra\xEDces, Boletas de Honorarios, F29 y F22 no son se\xF1al si aparece solo una p\xE1gina"
      ],
      rejectWhen: [
        "PDF de una sola p\xE1gina sin t\xEDtulo/portada/encabezado 'CARPETA TRIBUTARIA': nunca usar carpeta-tributaria, aunque tenga logo SII, pie 'P\xE1g. X / 12' o parezca una p\xE1gina extra\xEDda de una Carpeta",
        "una sola p\xE1gina con tabla 'Propiedades y Bienes Ra\xEDces' o columnas Comuna+ROL+Direcci\xF3n+Aval\xFAo Fiscal sin portada de Carpeta; no es carpeta-tributaria (es avaluo-fiscal si trae certificado SII, o no-clasificado)",
        "una sola p\xE1gina con tabla BHE/BTE 'Per\xEDodos / Honorario bruto / Retenci\xF3n / Total L\xEDquido' o 'PPM de contribuyente' sin portada de Carpeta; es resumen-boletas-sii",
        "una sola p\xE1gina con encabezado FORM. 22 o 'IMPUESTOS ANUALES A LA RENTA' sin portada de Carpeta; es declaracion-anual-impuestos",
        "una sola p\xE1gina con encabezado F29 o 'DECLARACI\xD3N MENSUAL Y PAGO SIMULT\xC1NEO DE IMPUESTOS FORMULARIO 29' sin portada de Carpeta; no es carpeta-tributaria"
      ],
      tieBreaker: [
        {
          vs: "declaracion-anual-impuestos",
          rule: "si el PDF tiene una sola p\xE1gina y no muestra portada/t\xEDtulo 'CARPETA TRIBUTARIA', no es carpeta; un F22 suelto con encabezado FORM. 22 es DAI aunque tenga pie 'P\xE1g. X / 12'"
        },
        {
          vs: "resumen-boletas-sii",
          rule: "si el PDF tiene una sola p\xE1gina y no muestra portada/t\xEDtulo 'CARPETA TRIBUTARIA', no es carpeta; una p\xE1gina suelta con tabla BHE/BTE/boletas es resumen-boletas-sii aunque tenga pie 'P\xE1g. X / 12'"
        }
      ]
    },
    fields: [
      {
        key: "rut",
        type: "string",
        internal: true
      },
      {
        key: "nombre",
        type: "string",
        internal: true
      },
      {
        key: "actividades",
        type: "list",
        ai: "Extrae todas las actividades econ\xF3micas del contribuyente como array de strings",
        internal: true
      },
      {
        key: "socios",
        type: "list",
        ai: "Extrae los socios de la empresa incluyendo nombre, RUT y porcentaje de participaci\xF3n de cada uno",
        internal: true
      },
      {
        key: "declaraciones_renta",
        type: "list",
        ai: `Extrae TODAS las Declaraciones de Renta (Formulario 22) del documento como array. Los c\xF3digos F22 aparecen dentro de recuadros (cuadros) de color naranja o salm\xF3n a la izquierda de cada fila. Cada entrada tiene: a\xF1o_tributario (n\xFAmero, ej: 2025), codes (objeto con los valores de los siguientes c\xF3digos \u2014 devuelve null si el c\xF3digo no aparece): 547 (Total Ingresos Brutos, Recuadro N\xB01), 110 (Honorarios y rem. directores S.A., art. 42 N\xB02 y 48), 104 (Retiros o remesas afectos al IGC o IA), 105 (Dividendos afectos al IGC o IA), 155 (Rentas de capitales mobiliarios, art. 20 N\xB02), 161 (Sueldos, pensiones y otras rentas similares, art. 42 N\xB01), 170 (Base Imponible Anual de IUSC o IGC), 305 (Resultado Liquidaci\xF3n Anual \u2014 puede ser negativo). Formato: { a\xF1o_tributario: 2024, codes: { "547": valor_o_null, "110": valor_o_null, ... } }. Busca en la secci\xF3n 'Declaraciones de Renta - Formulario 22 (F22)' del documento.`,
        internal: true
      },
      {
        key: "domicilio",
        type: "string",
        internal: true,
        ai: "Valor literal y completo del campo etiquetado 'Domicilio:' que aparece en la secci\xF3n 'Datos del Contribuyente' de la p\xE1gina 1. Es UNA sola l\xEDnea de texto (ej: 'CAMINO DE LAS LIEBRES 1408 , LO BARNECHEA'). Devuelve EXACTAMENTE lo que dice esa l\xEDnea, sin separar ni reformatear: calle, n\xFAmero, comuna y (si aparece) regi\xF3n como vienen en el PDF. PROHIBIDO inventar a partir de otras secciones: la secci\xF3n 'Propiedades y Bienes Ra\xEDces Registrados en el SII' lista inmuebles con columnas 'Direcci\xF3n' y 'Comuna' \u2014 esas NO son el domicilio del contribuyente. Tampoco uses direcciones de socios, sucursales, actividades econ\xF3micas ni representantes legales. Si el campo 'Domicilio:' de 'Datos del Contribuyente' no existe o est\xE1 vac\xEDo, devuelve null \u2014 no rellenes con bienes ra\xEDces."
      }
    ],
    howToObtain: {
      steps: [
        "Ingresa a <a href='https://www.sii.cl' target='_blank' rel='noopener'>www.sii.cl</a>",
        "Haz clic en <b>Servicios Online</b> \u2192 <b>Situaci\xF3n Tributaria</b>",
        "Inicia sesi\xF3n con tu Clave\xDAnica o Clave SII",
        "Selecciona <b>Obtener Carpeta Tributaria Electr\xF3nica</b>",
        "Elige <b>Para Tr\xE1mites</b> (o la opci\xF3n que corresponda)",
        "Descarga el PDF generado"
      ],
      tips: [
        "La carpeta incluye informaci\xF3n de los \xFAltimos 3 a\xF1os tributarios",
        "Tiene validez de 30 d\xEDas desde su emisi\xF3n"
      ]
    }
  },
  "cartola-banco": {
    label: "Cartola Bancaria",
    shortLabel: "Cartola",
    disambiguator: "entidad",
    source: "Banco",
    category: "respaldos",
    multiInstance: true,
    definition: "Cartola bancaria de cuenta corriente/vista, o posici\xF3n consolidada sin detalle de deuda.",
    classifier: {
      useWhen: [
        "cartola de movimientos de cuenta corriente/vista de un per\xEDodo, o posici\xF3n consolidada que apila varios productos sin detallar una deuda espec\xEDfica"
      ],
      signals: [
        "logo de un banco chileno (Santander, Scotiabank, BCI, Estado, Ita\xFA...)",
        "t\xEDtulo 'Cartola Hist\xF3rica' / 'Estado de Cuenta Bancaria' / 'Movimientos Cuenta Corriente' + tabla de cargos/abonos/saldos",
        "o varias secciones de producto apiladas en una vista (Cr\xE9ditos, Leasing, Hipotecarios, L\xEDnea de Cr\xE9dito, Tarjetas), cada una como tabla delgada"
      ],
      rejectWhen: [
        "estado de cuenta de tarjeta con N\xB0 de tarjeta, CAE, cupo, monto facturado",
        "pantalla/certificado/detalle enfocado en UN cr\xE9dito con saldo, cuota, vencimiento"
      ],
      tieBreaker: [
        {
          vs: "cuenta-ahorro",
          rule: "cartola = cuenta corriente/vista; cuenta-ahorro dice 'Cuenta de Ahorro' / 'Ahorro Vivienda' / 'Libreta de Ahorro'"
        },
        {
          vs: "deuda-comercial",
          rule: "cartola = vista consolidada; un cr\xE9dito comercial espec\xEDfico con saldo es deuda-comercial"
        },
        {
          vs: "deuda-consumo",
          rule: "cartola = varias secciones de producto en general; una fila/secci\xF3n clara de consumo o tarjeta con saldo/vencimiento es deuda-consumo"
        },
        {
          vs: "deuda-hipotecaria",
          rule: "cartola = vista consolidada; un cr\xE9dito hipotecario con N\xB0 de operaci\xF3n y saldo claros es deuda-hipotecaria"
        },
        {
          vs: "informe-deuda",
          rule: "cartola lleva logo de un banco; el informe de deudas lleva logo morado 'CMF'"
        },
        {
          vs: "inversiones",
          rule: "inversiones = instrumento de inversi\xF3n (DAP, fondo mutuo); cartola-banco = cuenta corriente/vista o vista consolidada"
        }
      ]
    },
    dateHint: "Usa el per\xEDodo de la cartola (mes/a\xF1o del estado de cuenta), no la fecha de emisi\xF3n ni la fecha de descarga",
    fields: [
      {
        key: "entidad",
        type: "string",
        internal: true,
        ai: "Nombre del banco emisor. Extraer del logo, encabezado o pie de p\xE1gina. Ej: 'Banco Ita\xFA Chile', 'BCI', 'Santander Chile'"
      },
      {
        key: "titular",
        type: "string",
        internal: true
      },
      {
        key: "numero_cuenta",
        type: "string",
        internal: true
      },
      {
        key: "periodo",
        type: "string",
        internal: true,
        ai: "Per\xEDodo del estado de cuenta en formato 'MM-YYYY' o rango 'DD-MM-YYYY a DD-MM-YYYY'"
      },
      {
        key: "saldo_final",
        type: "num",
        internal: true
      }
    ]
  },
  "contrato-arriendo": {
    label: "Contrato Arriendo",
    shortLabel: "Arriendo",
    disambiguator: "direccion_propiedad",
    source: "Notar\xEDa / Partes",
    category: "ingresos",
    multiInstance: true,
    definition: "Contrato de arriendo de propiedad inmueble entre arrendador y arrendatario.",
    classifier: {
      useWhen: [
        "contrato de uso temporal de un inmueble (no transferencia de dominio)"
      ],
      signals: [
        "t\xEDtulo 'CONTRATO DE ARRENDAMIENTO' / 'CONTRATO DE ARRIENDO' + cl\xE1usulas numeradas + valor mensual en CLP o UF"
      ],
      rejectWhen: [],
      tieBreaker: [
        {
          vs: "compraventa-propiedad",
          rule: "arriendo = t\xEDtulo 'ARRENDAMIENTO' + valor mensual; compraventa = t\xEDtulo 'COMPRAVENTA' + precio de venta + inscripci\xF3n CBR"
        }
      ]
    },
    dateHint: "Usa la fecha de inicio del arriendo (fecha de entrega del inmueble) como docdate. Si no aparece, usa la fecha de firma del contrato.",
    fields: [
      {
        key: "partes",
        type: "list",
        internal: true,
        ai: "Extrae todas las partes del contrato como array. Cada entrada tiene: nombre (nombre completo), rut (RUT si aparece), rol ('arrendador' o 'arrendatario')."
      },
      {
        key: "direccion_propiedad",
        type: "string",
        internal: true,
        ai: "Direcci\xF3n completa de la propiedad arrendada incluyendo n\xFAmero, piso/depto si aplica, y comuna. Ej: 'Av. Providencia 1234, Depto 502, Providencia'."
      },
      {
        key: "valor_mensual",
        type: "num",
        internal: true,
        ai: "Valor mensual del arriendo en pesos chilenos (CLP). En contratos notariales puede estar escrito en palabras \u2014 convierte a n\xFAmero entero. Si el valor est\xE1 en UF, deja este campo null y usa valor_mensual_uf."
      },
      {
        key: "valor_mensual_uf",
        type: "num",
        internal: true,
        ai: "Valor mensual del arriendo en Unidades de Fomento (UF). Solo si el contrato especifica el canon en UF. Convierte palabras a n\xFAmero decimal."
      },
      {
        key: "fecha_inicio",
        type: "date",
        internal: true,
        ai: "Fecha de inicio del arriendo o de entrega del inmueble. Formato YYYY-MM-DD."
      },
      {
        key: "fecha_termino",
        type: "date",
        internal: true,
        ai: "Fecha de t\xE9rmino o vencimiento del contrato de arriendo. null si es indefinido o de plazo autom\xE1ticamente renovable sin fecha fija."
      },
      {
        key: "fecha_firma",
        type: "date",
        internal: true
      },
      {
        key: "notaria",
        type: "string",
        internal: true,
        ai: "Nombre de la notar\xEDa donde se otorg\xF3 o autoriz\xF3 el contrato. null si es privado sin notarizaci\xF3n."
      },
      {
        key: "repertorio",
        type: "string",
        internal: true,
        ai: "N\xFAmero de repertorio notarial. Buscar 'Repertorio N\xB0', 'Rep. N\xB0', o similar. null si no est\xE1 notarializado."
      }
    ]
  },
  "deuda-comercial": {
    label: "Deuda Comercial",
    shortLabel: "Comercial",
    disambiguator: "entidad",
    source: "Banco",
    category: "deudas",
    multiInstance: true,
    definition: "Documento bancario de UN cr\xE9dito comercial o l\xEDnea de cr\xE9dito empresarial vigente.",
    classifier: {
      useWhen: [
        "certificado, estado de l\xEDnea o detalle bancario enfocado en un solo cr\xE9dito comercial espec\xEDfico"
      ],
      signals: [
        "logo de un banco; documento o pantallazo del portal enfocado en UN cr\xE9dito",
        "r\xF3tulo 'cr\xE9dito comercial' / 'l\xEDnea de cr\xE9dito' a nombre de empresa o persona con giro comercial",
        "campos del cr\xE9dito: N\xB0 de operaci\xF3n, saldo, cuota, vencimiento"
      ],
      rejectWhen: [
        "comprobante/voucher de una transacci\xF3n individual sin saldo total"
      ],
      tieBreaker: [
        {
          vs: "cartola-banco",
          rule: "deuda-comercial = un solo cr\xE9dito detallado; varias secciones de producto apiladas = cartola-banco"
        },
        {
          vs: "deuda-consumo",
          rule: "deuda-comercial = cr\xE9dito a empresa/giro comercial; deuda-consumo = cr\xE9dito personal o tarjeta de cr\xE9dito"
        },
        {
          vs: "deuda-hipotecaria",
          rule: "deuda-comercial = cr\xE9dito comercial; deuda-hipotecaria = cr\xE9dito de vivienda con 'dividendo' y N\xB0 de operaci\xF3n"
        },
        {
          vs: "informe-deuda",
          rule: "deuda-comercial lleva logo de un banco; el informe consolidado lleva logo morado 'CMF'"
        }
      ]
    },
    fields: [
      {
        key: "entidad",
        type: "string",
        internal: true
      },
      {
        key: "operacion",
        type: "string",
        ai: "Identificador \xFAnico del cr\xE9dito (n\xFAmero de operaci\xF3n, n\xFAmero de cr\xE9dito, o c\xF3digo \xFAnico asignado por el banco). Una persona puede tener m\xFAltiples cr\xE9ditos en el mismo banco, cada uno con su propio identificador.",
        internal: true
      },
      {
        key: "moneda",
        type: "string",
        ai: "Moneda del cr\xE9dito: 'UF' o 'CLP'. Buscar campo 'Moneda' en el documento. Si no se indica, asumir CLP.",
        internal: true
      },
      {
        key: "tipo",
        type: "string",
        internal: true
      },
      {
        key: "monto",
        type: "num",
        ai: "Monto original del cr\xE9dito como n\xFAmero decimal. En formato chileno el punto (.) separa miles y la coma (,) separa decimales: '6.458,0000' = 6458.0. Si el documento est\xE1 en UF, extraer el valor en UF.",
        internal: true
      },
      {
        key: "cuota_mensual",
        type: "num",
        ai: "Cuota mensual como n\xFAmero decimal. En formato chileno '28,9000' = 28.9. Si el documento est\xE1 en UF, extraer el valor en UF.",
        internal: true
      },
      {
        key: "saldo_insoluto",
        type: "num",
        ai: "Saldo insoluto como n\xFAmero decimal. En formato chileno '4.643,8549' = 4643.8549. Si el documento est\xE1 en UF, extraer el valor en UF.",
        internal: true
      },
      {
        key: "cuotas_pagadas",
        type: "num",
        ai: "N\xFAmero de cuotas ya pagadas/canceladas.",
        internal: true
      },
      {
        key: "cuotas_totales",
        type: "num",
        ai: "N\xFAmero total de cuotas del cr\xE9dito.",
        internal: true
      },
      {
        key: "caev",
        type: "num",
        internal: true
      }
    ]
  },
  "deuda-consumo": {
    label: "Cr\xE9dito de Consumo",
    shortLabel: "Consumo",
    disambiguator: "entidad",
    source: "Banco",
    category: "deudas",
    freq: "once",
    count: 1,
    multiInstance: true,
    definition: "Documento bancario de un cr\xE9dito de consumo vigente o deuda de tarjeta de cr\xE9dito.",
    classifier: {
      useWhen: [
        "documento bancario enfocado en un cr\xE9dito de consumo o en una tarjeta de cr\xE9dito"
      ],
      signals: [
        "portal: logo del banco + t\xEDtulo tipo 'Cr\xE9ditos de consumo vigentes' + tabla de un producto (N\xBA cuotas, Saldo de deuda, Monto cuota)",
        "tarjeta: t\xEDtulo 'ESTADO DE CUENTA ... TARJETA DE CR\xC9DITO', 'N\xBA DE TARJETA XXXX-XXXX-XXXX-NNNN', 'CAE', 'CUPO TOTAL/UTILIZADO/DISPONIBLE', 'MONTO M\xCDNIMO A PAGAR', 'MONTO FACTURADO'"
      ],
      rejectWhen: [
        "comprobante/voucher de una transacci\xF3n individual (pago, transferencia, abono) sin saldo total, cuotas, CAE ni monto facturado"
      ],
      tieBreaker: [
        {
          vs: "cartola-banco",
          rule: "deuda-consumo = enfocado en consumo/tarjeta (CAE, cupo, monto facturado); cartola = varias secciones de producto apiladas en general"
        },
        {
          vs: "deuda-comercial",
          rule: "deuda-consumo = cr\xE9dito personal o tarjeta; deuda-comercial = cr\xE9dito a empresa / giro comercial"
        },
        {
          vs: "deuda-hipotecaria",
          rule: "deuda-consumo = tarjeta o cr\xE9dito de consumo; deuda-hipotecaria = 'AVISO DE PAGO CR\xC9DITO HIPOTECARIO' con 'dividendo'"
        },
        {
          vs: "informe-deuda",
          rule: "deuda-consumo lleva logo de un banco; el informe consolidado lleva logo morado 'CMF'"
        }
      ]
    },
    fields: [
      {
        key: "entidad",
        type: "string",
        internal: true
      },
      {
        key: "numero_credito",
        type: "string",
        internal: true
      },
      {
        key: "descripcion",
        type: "string",
        internal: true
      },
      {
        key: "tipo",
        type: "string",
        ai: "D=Directo, I=Indirecto",
        internal: true
      },
      {
        key: "monto",
        type: "num",
        internal: true
      },
      {
        key: "saldo",
        type: "num",
        internal: true
      },
      {
        key: "cuota",
        type: "num"
      },
      {
        key: "vencimiento",
        type: "string",
        internal: true
      },
      {
        key: "cuotas_pagadas",
        type: "num"
      },
      {
        key: "cuotas_totales",
        type: "num"
      }
    ]
  },
  "deuda-hipotecaria": {
    label: "Deuda Hipotecaria",
    shortLabel: "Hipo",
    disambiguator: "entidad",
    source: "Banco",
    category: "deudas",
    freq: "once",
    count: 1,
    multiInstance: true,
    definition: "Documento bancario de UN cr\xE9dito hipotecario o mutuario vigente.",
    classifier: {
      useWhen: [
        "documento bancario enfocado en un solo cr\xE9dito hipotecario"
      ],
      signals: [
        "t\xEDtulo tipo 'AVISO DE PAGO CR\xC9DITO HIPOTECARIO' / 'AVISO DE DIVIDENDO' + logo del banco",
        "campos: 'NRO. OPERACI\xD3N', 'MONTO ORIGINAL' en UF, tabla de 'DIVIDENDO' (Saldo Insoluto, Amortizaci\xF3n, Inter\xE9s, Comisi\xF3n)"
      ],
      rejectWhen: [],
      tieBreaker: [
        {
          vs: "cartola-banco",
          rule: "deuda-hipotecaria = documento enfocado en un cr\xE9dito hipotecario; varias secciones de producto apiladas = cartola-banco"
        },
        {
          vs: "compraventa-propiedad",
          rule: "deuda-hipotecaria = aviso/certificado bancario independiente; cl\xE1usulas de hipoteca dentro de una escritura van con compraventa-propiedad"
        },
        {
          vs: "deuda-comercial",
          rule: "deuda-hipotecaria = cr\xE9dito de vivienda; deuda-comercial = cr\xE9dito a empresa / giro comercial"
        },
        {
          vs: "deuda-consumo",
          rule: "deuda-hipotecaria = 'dividendo' + cr\xE9dito de vivienda; deuda-consumo = tarjeta o cr\xE9dito de consumo (CAE, cupo)"
        }
      ]
    },
    fields: [
      {
        key: "entidad",
        type: "string",
        internal: true
      },
      {
        key: "operacion",
        type: "string",
        ai: "Identificador \xFAnico del cr\xE9dito (n\xFAmero de operaci\xF3n, n\xFAmero de cr\xE9dito, o c\xF3digo \xFAnico asignado por el banco). Una persona puede tener m\xFAltiples cr\xE9ditos en el mismo banco, cada uno con su propio identificador.",
        internal: true
      },
      {
        key: "moneda",
        type: "string",
        ai: "Moneda del cr\xE9dito: 'UF' o 'CLP'. Buscar campo 'Moneda' en el documento. Si no se indica, asumir CLP.",
        internal: true
      },
      {
        key: "monto_credito",
        type: "num",
        ai: "Monto original del cr\xE9dito como n\xFAmero decimal. IMPORTANTE: en formato chileno el punto (.) separa miles y la coma (,) separa decimales. Ejemplo: '6.458,0000' = 6458.0 \u2014 no 64580000. Si el documento est\xE1 en UF, extraer el valor en UF (ej: 6458.0).",
        internal: true
      },
      {
        key: "cuota_mensual",
        type: "num",
        ai: "Dividendo o cuota mensual como n\xFAmero decimal. IMPORTANTE: en formato chileno '28,9000' = 28.9 \u2014 no 289000. En avisos de pago hipotecario buscar en 'DIVIDENDO' (incluye amortizaci\xF3n + inter\xE9s + comisi\xF3n) o en 'TOTAL DEL MES' (dividendo + seguros). Si el documento est\xE1 en UF, extraer el valor en UF.",
        internal: true
      },
      {
        key: "saldo_insoluto",
        type: "num",
        ai: "Saldo insoluto (deuda pendiente) como n\xFAmero decimal. IMPORTANTE: en formato chileno '4.643,8549' = 4643.8549 \u2014 no 46438549. Si el documento est\xE1 en UF, extraer el valor en UF.",
        internal: true
      },
      {
        key: "tasa_interes",
        type: "num",
        ai: "Tasa de inter\xE9s como porcentaje decimal. Ejemplo: '8,3179' = 8.3179 (no 83179).",
        internal: true
      },
      {
        key: "cuotas_pagadas",
        type: "num",
        ai: "N\xFAmero de cuotas o dividendos ya pagados/cancelados (ej: 'Cancelados 111 de 300' \u2192 111).",
        internal: true
      },
      {
        key: "cuotas_totales",
        type: "num",
        ai: "N\xFAmero total de cuotas o dividendos del cr\xE9dito (ej: 'Cancelados 111 de 300' \u2192 300).",
        internal: true
      },
      {
        key: "caev",
        type: "num",
        internal: true
      }
    ]
  },
  "informe-deuda": {
    label: "Informe de Deuda CMF",
    shortLabel: "CMF",
    source: "CMF",
    category: "deudas",
    freq: "once",
    count: 1,
    definition: "Informe de Deudas emitido exclusivamente por la CMF (Comisi\xF3n para el Mercado Financiero).",
    classifier: {
      useWhen: [
        "informe de deudas emitido por la CMF \u2014 un solo documento que cubre todas sus p\xE1ginas"
      ],
      signals: [
        "logo morado 'CMF' / 'COMISI\xD3N PARA EL MERCADO FINANCIERO' + t\xEDtulo 'Informe de Deudas'",
        "recuadro destacado 'Deuda total' con barra horizontal dividida en 4 (Vigente / 30-59 / 60-89 / 90+ d\xEDas de atraso)",
        "secciones 'Deuda Directa', 'Deuda Indirecta', 'Cr\xE9ditos disponibles'; pie menciona 'Ley N\xB0 21.680' y www.cmfchile.cl"
      ],
      rejectWhen: [],
      tieBreaker: [
        {
          vs: "cartola-banco",
          rule: "informe-deuda = logo 'CMF'; cartola = logo de un banco"
        },
        {
          vs: "deuda-comercial",
          rule: "deuda-comercial lleva logo de un banco; el informe consolidado lleva logo morado 'CMF'"
        },
        {
          vs: "deuda-consumo",
          rule: "deuda-consumo lleva logo de un banco; el informe consolidado lleva logo morado 'CMF'"
        },
        {
          vs: "informe-credito",
          rule: "informe-deuda = logo morado 'CMF'; informe-credito = logo de un bureau privado + 'INFORME COMERCIAL'"
        }
      ]
    },
    dateHint: "Usa la fecha del informe tal como aparece en el documento (fecha de consulta CMF)",
    fields: [
      {
        key: "rut",
        type: "string",
        internal: true
      },
      {
        key: "nombre",
        type: "string",
        internal: true
      },
      {
        key: "deuda_total",
        type: "num",
        internal: true
      },
      {
        key: "fecha_informe",
        type: "date",
        ai: "Fecha de consulta del informe CMF impresa en el encabezado o pie del documento. Mismo valor que docdate. Formato YYYY-MM-DD.",
        internal: true
      },
      {
        key: "deudas",
        type: "list",
        ai: "Extrae SOLO las filas de la secci\xF3n 'Deuda Directa' (deudas como titular). NO incluir filas de 'Cr\xE9ditos disponibles' ni 'L\xEDneas de cr\xE9dito' (esas son cr\xE9dito disponible, no deuda). Cada entrada: entidad, tipo (Consumo/Vivienda/Comercial/Tarjeta de cr\xE9dito/L\xEDnea de cr\xE9dito/etc. tal como aparece), total_credito (columna 'Total del cr\xE9dito'), vigente (columna 'Vigente'), atraso_30_59, atraso_60_89, atraso_90_mas. Si una instituci\xF3n aparece solo en 'Cr\xE9ditos disponibles' y NO en 'Deuda Directa', NO la incluyas",
        internal: true
      },
      {
        key: "deudas_indirectas",
        type: "list",
        ai: "Extrae TODAS las deudas de la tabla 'Deuda Indirecta' como array, donde cada entrada tiene: entidad, tipo, total_credito, vigente, atraso_30_59, atraso_60_89, atraso_90_mas. Si dice 'No registra informaci\xF3n para esta secci\xF3n' devuelve array vac\xEDo []",
        internal: true
      },
      {
        key: "lineas_credito",
        type: "list",
        ai: "Extrae TODAS las filas de 'L\xEDneas de cr\xE9dito' (bajo 'Cr\xE9ditos disponibles'). Cada fila: entidad (string, instituci\xF3n financiera), directos (num, monto columna Directos), indirectos (num, monto columna Indirectos). Si 'No registra informaci\xF3n' \u2192 array vac\xEDo []",
        internal: true
      },
      {
        key: "otros_creditos",
        type: "list",
        ai: "Extrae TODAS las filas de 'Otros cr\xE9ditos' (bajo 'Cr\xE9ditos disponibles'). Cada fila: entidad (string, instituci\xF3n financiera), directos (num), indirectos (num). Si 'No registra informaci\xF3n' \u2192 array vac\xEDo []",
        internal: true
      }
    ]
  },
  "informe-credito": {
    label: "Informe Comercial",
    shortLabel: "Deuda",
    source: "DICOM / Maat / Sinacofi / TransUnion / Regcheq",
    category: "deudas",
    freq: "once",
    count: 1,
    definition: "Informe comercial de bureaus de cr\xE9dito o compliance chilenos (DICOM, Equifax, Maat, etc.).",
    classifier: {
      useWhen: [
        "informe de un bureau de cr\xE9dito o compliance privado"
      ],
      signals: [
        "logo de bureau (Maat, DICOM/Equifax, Sinacofi, TransUnion, Dest\xE1came, ICAV, Regcheq) + badge 'INFORME COMERCIAL'",
        "puntaje crediticio en c\xEDrculo (ej. '950 A'), r\xF3tulo 'Riesgo Crediticio', 'Morosidad Vigente $'",
        "secciones 'Protestos', 'Infocom', 'Red Bancaria', 'Puntaje Score'; o listas restrictivas (PEP, OFAC, GAFI)"
      ],
      rejectWhen: [
        "fragmentos de expedientes judiciales, listas de acreedores concursales (SUPERIR), listas de juicios pendientes"
      ],
      tieBreaker: [
        {
          vs: "informe-deuda",
          rule: "informe-credito = logo de bureau privado + 'INFORME COMERCIAL'; informe-deuda = logo morado 'CMF'"
        }
      ]
    },
    dateHint: "Usa la fecha de elaboraci\xF3n o consulta del informe",
    fields: [
      {
        key: "rut",
        type: "string",
        internal: true
      },
      {
        key: "nombre",
        type: "string",
        internal: true
      },
      {
        key: "fuente",
        type: "string",
        internal: true,
        ai: "Identifica el proveedor del informe: Maat, DICOM, Equifax, Sinacofi, TransUnion, Dest\xE1came, ICAV, Regcheq, u otro"
      },
      {
        key: "puntaje",
        type: "num",
        internal: true,
        ai: "Puntaje o score crediticio (ej: 'PUNTAJE SCORE MAAT', 'Score DICOM', etc.). Solo el n\xFAmero. null si no aparece"
      },
      {
        key: "morosidades_vigentes",
        type: "num",
        internal: true,
        ai: "Monto total de morosidades vigentes en pesos chilenos. Buscar 'TOTAL MOROSIDAD VIGENTE' o equivalente. Si es '-' o vac\xEDo, devolver 0. null si no aparece en el informe"
      },
      {
        key: "protestos_vigentes",
        type: "num",
        internal: true,
        ai: "Monto total de protestos vigentes en pesos chilenos. Buscar 'TOTAL PROTESTOS' o equivalente. Si es '-' o vac\xEDo, devolver 0. null si no aparece en el informe"
      },
      {
        key: "morosidad_previsional",
        type: "num",
        internal: true,
        ai: "Total morosidad previsional en pesos. 0 si es '-' o vac\xEDo. null si no aparece"
      },
      {
        key: "morosidad_laboral",
        type: "num",
        internal: true,
        ai: "Total morosidad laboral en pesos. 0 si es '-' o vac\xEDo. null si no aparece"
      },
      {
        key: "morosidad_comercio",
        type: "num",
        internal: true,
        ai: "Total morosidad comercio en pesos. 0 si es '-' o vac\xEDo. null si no aparece"
      },
      {
        key: "quiebras",
        type: "bool",
        internal: true,
        ai: "\xBFTiene eventos de quiebra registrados? true/false. Buscar 'EVENTOS QUIEBRAS' o equivalente"
      },
      {
        key: "compliance_estado",
        type: "string",
        internal: true,
        ai: "Estado de compliance/listas restrictivas. Ej: 'Sin coincidencias', 'Con coincidencias en lista X', 'PEP', etc. null si el informe no incluye verificaci\xF3n de compliance"
      },
      {
        key: "protestos",
        type: "list",
        internal: true,
        ai: "Extrae el detalle de protestos como array. Cada entrada tiene: fecha, acreedor, tipo_documento, monto, numero_documento, tipo_credito. Array vac\xEDo si no hay protestos"
      },
      {
        key: "morosidades",
        type: "list",
        internal: true,
        ai: "Extrae el detalle de morosidades vigentes como array. Cada entrada tiene: fecha_vencimiento, tipo_credito, monto, acreedor. Array vac\xEDo si no hay morosidades"
      }
    ]
  },
  "avaluo-fiscal": {
    label: "Aval\xFAo Fiscal",
    shortLabel: "Aval\xFAo",
    source: "SII",
    category: "activos",
    freq: "once",
    count: 1,
    multiInstance: true,
    definition: "Certificado de Aval\xFAo Fiscal emitido exclusivamente por el SII.",
    classifier: {
      useWhen: [
        "certificado SII de aval\xFAo fiscal \u2014 UN SOLO documento que cubre todas sus p\xE1ginas, aunque liste una propiedad distinta por p\xE1gina"
      ],
      signals: [
        "logo SII arriba-izquierda + t\xEDtulo centrado 'CERTIFICADO DE AVAL\xDAO FISCAL' (ambos OBLIGATORIOS)",
        "campos: Comuna, N\xFAmero de ROL de Aval\xFAo, Direcci\xF3n, Destino del bien ra\xEDz, Registrado a Nombre de + RUN/RUT",
        "filas AVAL\xDAO TOTAL / AVAL\xDAO EXENTO DE IMPUESTO / AVAL\xDAO AFECTO A IMPUESTO; pie gris 'CERTIFICADO GRATUITO'"
      ],
      rejectWhen: [
        "escritura de compraventa, certificado de dominio, tasaci\xF3n comercial"
      ],
      tieBreaker: [
        {
          vs: "carton-ds1",
          rule: "aval\xFAo = logo SII + ROL + tasaci\xF3n; DS1 = membrete MINVU + subsidio habitacional"
        },
        {
          vs: "compraventa-propiedad",
          rule: "aval\xFAo = logo SII + t\xEDtulo 'CERTIFICADO DE AVAL\xDAO FISCAL' + ROL; compraventa = escritura notarial con cl\xE1usulas y precio de venta"
        }
      ]
    },
    dateHint: "Usa la fecha de emisi\xF3n del certificado",
    fields: [
      {
        key: "propiedades",
        type: "list",
        ai: "Extrae TODAS las propiedades del certificado como array (una por p\xE1gina). Cada entrada tiene: rol (string, N\xFAmero de ROL de Aval\xFAo formato XXXXX-XXXXX), direccion (string, direcci\xF3n completa), comuna (string), destino (string, ej: Habitacional, Estacionamiento, Bodega y Almacenaje, Comercial, Agr\xEDcola), nombre_registrado (string, nombre completo del propietario registrado), run_registrado (string, RUN o RUT registrado con d\xEDgito verificador), porcentaje_derecho (number, % de derecho como n\xFAmero ej: 100 para 100%), avaluo_total (number, aval\xFAo total en pesos como entero sin separadores), avaluo_exento (number, aval\xFAo exento de impuesto en pesos), avaluo_afecto (number, aval\xFAo afecto a impuesto en pesos)"
      }
    ],
    howToObtain: {
      steps: [
        "Ingresa a <a href='https://www.sii.cl' target='_blank' rel='noopener'>www.sii.cl</a>",
        "Haz clic en <b>Servicios Online</b> \u2192 <b>Aval\xFAos y Contribuciones de Bienes Ra\xEDces</b>",
        "Inicia sesi\xF3n con tu Clave\xDAnica o Clave SII",
        "Selecciona <b>Consulta de Aval\xFAo y Certificado</b>",
        "Se listar\xE1n todas tus propiedades. Haz clic en <b>Certificado</b> para descargar el PDF"
      ],
      tips: [
        "El certificado incluye todas las propiedades registradas a tu nombre",
        "Tiene validez de 30 d\xEDas desde su emisi\xF3n",
        "El aval\xFAo fiscal NO corresponde a una tasaci\xF3n comercial"
      ]
    }
  },
  "compraventa-propiedad": {
    label: "Compraventa de Propiedad",
    shortLabel: "VentaProp",
    disambiguator: "comuna",
    source: "Notar\xEDa",
    category: "activos",
    freq: "once",
    count: 1,
    multiInstance: true,
    definition: "Escritura notarial de compraventa de propiedad inmueble.",
    classifier: {
      useWhen: [
        "escritura p\xFAblica (o copia fiel/certificada) de compraventa de un inmueble"
      ],
      signals: [
        "p\xE1ginas con t\xEDtulo 'COMPRAVENTA' / 'CONTRATO COMPRAVENTA' / 'COMPRAVENTA MUTUO E HIPOTECA'",
        "documento notarial largo con cl\xE1usulas; n\xFAmero de repertorio, firma ante notario",
        "comprador y vendedor con RUT; inmueble con direcci\xF3n, deslindes, inscripci\xF3n CBR; precio de venta en CLP o UF"
      ],
      rejectWhen: [
        "es promesa de compraventa"
      ],
      tieBreaker: [
        {
          vs: "avaluo-fiscal",
          rule: "compraventa = escritura notarial; aval\xFAo = logo SII + t\xEDtulo 'CERTIFICADO DE AVAL\xDAO FISCAL'"
        },
        {
          vs: "carton-ds1",
          rule: "DS1 = certificado de una p\xE1gina; compraventa = escritura notarial larga con cl\xE1usulas"
        },
        {
          vs: "contrato-arriendo",
          rule: "compraventa = t\xEDtulo 'COMPRAVENTA' + precio de venta + inscripci\xF3n CBR; arriendo = t\xEDtulo 'ARRENDAMIENTO' + valor mensual"
        },
        {
          vs: "deuda-hipotecaria",
          rule: "cl\xE1usulas de hipoteca dentro de la escritura van con compraventa; un aviso/certificado bancario independiente es deuda-hipotecaria"
        }
      ]
    },
    dateHint: "Usa la fecha de firma de la escritura ante notario",
    fields: [
      {
        key: "comprador",
        type: "string",
        internal: true
      },
      {
        key: "vendedor",
        type: "string",
        internal: true
      },
      {
        key: "direccion",
        type: "string",
        internal: true
      },
      {
        key: "comuna",
        type: "string",
        internal: true
      },
      {
        key: "monto",
        type: "num",
        internal: true
      }
    ]
  },
  "cuenta-ahorro": {
    label: "Cuenta de Ahorro",
    shortLabel: "Ahorro",
    disambiguator: "banco",
    source: "Banco",
    category: "activos",
    multiInstance: true,
    definition: "Certificado o cartola de cuenta de ahorro bancaria.",
    classifier: {
      useWhen: [
        "certificado o cartola de una cuenta de ahorro bancaria"
      ],
      signals: [
        "logo de un banco chileno + nombre del producto 'Cuenta de Ahorro' / 'Ahorro Vivienda' / 'Libreta de Ahorro' visible"
      ],
      rejectWhen: [],
      tieBreaker: [
        {
          vs: "cartola-banco",
          rule: "cuenta-ahorro dice 'Cuenta de Ahorro' / 'Ahorro Vivienda'; cartola-banco es de cuenta corriente o vista"
        },
        {
          vs: "inversiones",
          rule: "cuenta-ahorro = cuenta de ahorro; dep\xF3sito a plazo / fondo mutuo (t\xEDtulo 'Dep\xF3sitos a Plazo', 'DAP') es inversiones"
        }
      ]
    },
    fields: [
      {
        key: "banco",
        type: "string",
        internal: true
      },
      {
        key: "tipo_cuenta",
        type: "string",
        internal: true
      },
      {
        key: "saldo",
        type: "num",
        internal: true
      }
    ]
  },
  inversiones: {
    label: "Inversiones",
    shortLabel: "Inv",
    disambiguator: "banco",
    source: "Banco",
    category: "activos",
    multiInstance: true,
    definition: "Documento de inversiones bancarias o financieras (DAP, fondos mutuos, custodia).",
    classifier: {
      useWhen: [
        "documento de un instrumento de inversi\xF3n emitido por banco o instituci\xF3n financiera"
      ],
      signals: [
        "logo de banco o instituci\xF3n financiera + t\xEDtulo 'Dep\xF3sitos a Plazo' / 'DAP' / 'Plazo Fijo' / fondo mutuo"
      ],
      rejectWhen: [],
      tieBreaker: [
        {
          vs: "cartola-banco",
          rule: "inversiones = instrumento de inversi\xF3n (DAP, fondo mutuo); cartola-banco = cuenta corriente/vista o vista consolidada"
        },
        {
          vs: "cuenta-ahorro",
          rule: "inversiones = t\xEDtulo 'Dep\xF3sitos a Plazo' / 'DAP' / fondo mutuo; cuenta-ahorro = 'Cuenta de Ahorro' / 'Libreta de Ahorro'"
        }
      ]
    },
    fields: [
      {
        key: "titular",
        type: "string",
        internal: true
      },
      {
        key: "banco",
        type: "string",
        internal: true
      },
      {
        key: "saldo",
        type: "num",
        internal: true,
        ai: "Monto total invertido. Para DAP: suma de todos los montos finales (capital + intereses). Si hay un resumen con 'Total invertido', usar ese valor."
      },
      {
        key: "depositos",
        type: "list",
        internal: true,
        ai: "Lista de dep\xF3sitos o inversiones individuales. Cada item: {monto_inicial, monto_final, tasa, plazo_dias, fecha_inicio, fecha_vencimiento, tipo, moneda}. monto_inicial y monto_final son num\xE9ricos. tasa es porcentaje (ej: 0.27 para 0,27%). plazo_dias es n\xFAmero entero. tipo es el tipo de instrumento de inversi\xF3n. Valores posibles: 'DAP' (Dep\xF3sito a Plazo), 'Fondo Mutuo', 'APV' (Ahorro Previsional Voluntario), 'Fondo de Inversi\xF3n', 'Seguro con Ahorro'. NO usar el tipo de tasa (Fijo/Renovable) como tipo. moneda es 'CLP', 'USD', 'UF', o 'EUR'."
      }
    ]
  },
  padron: {
    label: "Padr\xF3n de Veh\xEDculo",
    shortLabel: "Padr\xF3n",
    disambiguator: "marca",
    source: "Registro Civil",
    category: "activos",
    freq: "once",
    count: 1,
    multiInstance: true,
    extractScope: "firstPage",
    definition: "Padr\xF3n de veh\xEDculo \u2014 certificado de inscripci\xF3n de veh\xEDculo motorizado del Registro Civil.",
    classifier: {
      useWhen: [
        "certificado de inscripci\xF3n de un veh\xEDculo motorizado"
      ],
      signals: [
        "t\xEDtulo naranjo 'CERTIFICADO DE INSCRIPCION Y ANOTACIONES VIGENTES EN EL R. V. M.' + plantilla Registro Civil",
        "secci\xF3n 'DATOS DEL VEHICULO' (Marca, Modelo, Nro. Motor, Nro. Chasis) + campo 'Inscripci\xF3n' con la placa patente"
      ],
      rejectWhen: [
        "es permiso de circulaci\xF3n, revisi\xF3n t\xE9cnica o SOAP"
      ],
      tieBreaker: [
        {
          vs: "cert-nacimiento-hijo",
          rule: "misma plantilla Registro Civil \u2014 padr\xF3n tiene 'DATOS DEL VEHICULO' (marca, motor, chasis); nacimiento tiene datos de una persona"
        }
      ]
    },
    fields: [
      {
        key: "inscripcion",
        type: "string",
        internal: true
      },
      {
        key: "rut_propietario",
        type: "string",
        internal: true
      },
      {
        key: "propietario",
        type: "string",
        internal: true
      },
      {
        key: "domicilio",
        type: "string",
        internal: true
      },
      {
        key: "comuna",
        type: "string",
        internal: true
      },
      {
        key: "fecha_adquisicion",
        type: "date",
        internal: true
      },
      {
        key: "fecha_inscripcion",
        type: "date",
        internal: true
      },
      {
        key: "fecha_emision",
        type: "date",
        internal: true
      },
      {
        key: "marca",
        type: "string",
        internal: true
      },
      {
        key: "modelo",
        type: "string",
        internal: true
      },
      {
        key: "motor",
        type: "string",
        internal: true
      },
      {
        key: "chasis",
        type: "string",
        internal: true
      },
      {
        key: "color",
        type: "string",
        internal: true
      },
      {
        key: "tasacion_fiscal",
        type: "num",
        internal: true
      },
      {
        key: "a\xF1o",
        type: "num"
      }
    ],
    derived: [
      {
        key: "precio_mercado_clp",
        type: "num",
        input_fields: [
          "marca",
          "modelo",
          "a\xF1o"
        ],
        prompt: 'Eres un tasador de veh\xEDculos usados en Chile.\n\nVeh\xEDculo: {{marca}} {{modelo}}, a\xF1o {{a\xF1o}}.\n\nBusca este veh\xEDculo ESPEC\xCDFICO del a\xF1o {{a\xF1o}} en el mercado de usados chileno.\n\nReglas:\n- Busca precios de este modelo USADO del a\xF1o {{a\xF1o}}, NO el modelo nuevo actual.\n- Los precios publicados en portales (chileautos, yapo, mercadolibre) son precios de OFERTA, no de venta real. Estima el precio de transacci\xF3n real (10-20% menos que el precio publicado).\n- Un veh\xEDculo del a\xF1o {{a\xF1o}} tiene aproximadamente {{__age__}} a\xF1os de uso. Debe reflejar depreciaci\xF3n acorde.\n- Si no encuentras datos confiables para este modelo y a\xF1o espec\xEDfico, responde: null\n\nResponde SOLO con JSON: {"precio": <n\xFAmero entero CLP o null>}',
        grounding: true
      }
    ]
  }
};

// src/data.ts
var doctypesCatalog = doctypes_default;
function getRawDoctypes() {
  return doctypesCatalog;
}

// src/doctypes.ts
var TYPE_DEFAULTS = {
  string: "",
  date: "YYYY-MM-DD",
  month: "YYYY-MM",
  time: "HH:MM",
  num: 0,
  bool: false,
  list: [],
  obj: {}
};
function expandFields(fieldDefs) {
  const result = {};
  const internalFields = /* @__PURE__ */ new Set();
  for (const field of fieldDefs) {
    const defaultValue = TYPE_DEFAULTS[field.type] ?? "";
    const parts = field.key.split(".");
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }
    current[parts[parts.length - 1]] = defaultValue;
    if (field.internal) {
      internalFields.add(field.key);
    }
  }
  return { fields: result, internalFields };
}
function generateInstructions(fieldDefs) {
  const simple = [];
  const custom = [];
  for (const field of fieldDefs) {
    if (field.ai) {
      custom.push(`${field.key}: ${field.ai}`);
    } else {
      const label = field.key.replace(/\./g, " \u2192 ");
      simple.push(field.type !== "string" ? `${label} (${field.type})` : label);
    }
  }
  const parts = [];
  if (simple.length > 0) {
    parts.push(`Extrae: ${simple.join(", ")}.`);
  }
  if (custom.length > 0) {
    parts.push(custom.join(". ") + ".");
  }
  return parts.join(" ");
}
function getExpandedDoctypes() {
  const raw = getRawDoctypes();
  const expanded = {};
  for (const [id, dt] of Object.entries(raw)) {
    const { fields, internalFields } = expandFields(dt.fields);
    expanded[id] = {
      label: dt.label,
      shortLabel: dt.shortLabel,
      category: dt.category,
      freq: dt.freq || "once",
      count: dt.count ?? 1,
      maxAge: dt.maxAge,
      graceDays: dt.graceDays,
      hasFechaVencimiento: dt.fields?.some((f) => f.key === "fecha_vencimiento") ?? false,
      multiInstance: dt.multiInstance,
      pageAtomic: dt.pageAtomic,
      extractScope: dt.extractScope,
      parts: dt.parts,
      contains: dt.contains,
      definition: dt.definition,
      dateHint: dt.dateHint,
      instructions: generateInstructions(dt.fields),
      fields,
      fieldDefs: dt.fields,
      internalFields,
      howToObtain: dt.howToObtain
    };
  }
  return expanded;
}
function getDoctypesMap() {
  return getExpandedDoctypes();
}
function getDoctypes() {
  const map = getDoctypesMap();
  return Object.entries(map).map(([id, doctype]) => ({
    id,
    ...doctype
  })).sort((a, b) => a.label.localeCompare(b.label));
}
function getDoctype(id) {
  const map = getDoctypesMap();
  const doctype = map[id];
  if (!doctype) return null;
  return { id, ...doctype };
}
function getDoctypeIds() {
  return Object.keys(getDoctypesMap());
}
function isDoctypeValid(id) {
  return id in getDoctypesMap();
}
function isMultiInstanceDocType(id) {
  return getDoctypesMap()[id]?.multiInstance === true;
}
function getDoctypesLegacyFormat() {
  return getDoctypes().map((dt) => ({
    id: dt.id,
    label: dt.label,
    definition: dt.definition,
    instructions: dt.instructions,
    fields: dt.fields,
    category: dt.category,
    multiInstance: dt.multiInstance || void 0
  }));
}
function getDoctypesByCategory(category) {
  return getDoctypes().filter((dt) => dt.category === category);
}
function getCategories() {
  const categories = new Set(
    getDoctypes().map((dt) => dt.category).filter(Boolean)
  );
  return Array.from(categories);
}
function getInternalFieldKeys(doctypeId) {
  const dt = getDoctypesMap()[doctypeId];
  if (!dt) return [];
  return [...dt.internalFields];
}
function getDocumentDefaults(doctypeid) {
  const dt = getDoctypesMap()[doctypeid];
  return dt ? { freq: dt.freq, count: dt.count } : { freq: "once", count: 1 };
}
function isRecurring(doctypeid) {
  const dt = getDoctypesMap()[doctypeid];
  return dt?.freq === "monthly" || dt?.freq === "annual";
}
function isValidFreq(freq) {
  return freq === "once" || freq === "monthly" || freq === "annual";
}
function applyDefaults(requirements) {
  const result = {};
  for (const [doctypeid, req] of Object.entries(requirements)) {
    if (doctypeid === "periodstart") {
      result[doctypeid] = req;
      continue;
    }
    const defaults = getDocumentDefaults(doctypeid);
    const freq = isValidFreq(req?.freq) ? req.freq : defaults.freq;
    const count = typeof req?.count === "number" && req.count > 0 ? req.count : defaults.count;
    result[doctypeid] = { freq, count };
  }
  return result;
}

exports.applyDefaults = applyDefaults;
exports.doctypesCatalog = doctypesCatalog;
exports.getCategories = getCategories;
exports.getDoctype = getDoctype;
exports.getDoctypeIds = getDoctypeIds;
exports.getDoctypes = getDoctypes;
exports.getDoctypesByCategory = getDoctypesByCategory;
exports.getDoctypesLegacyFormat = getDoctypesLegacyFormat;
exports.getDoctypesMap = getDoctypesMap;
exports.getDocumentDefaults = getDocumentDefaults;
exports.getInternalFieldKeys = getInternalFieldKeys;
exports.getRawDoctypes = getRawDoctypes;
exports.isDoctypeValid = isDoctypeValid;
exports.isMultiInstanceDocType = isMultiInstanceDocType;
exports.isRecurring = isRecurring;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map