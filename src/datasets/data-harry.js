/* eslint-disable */
export default {
  nodes: [
    {
      id: 0,
      name: 'Hermione',
      surname: 'Granger',
      dataClass: 'person',
      type: 'regular',
      label: 'GRANGER Hermione',
      birthDate: '19-09-1979'
    },
    {
      id: 1,
      name: 'Harry',
      surname: 'Potter',
      dataClass: 'person',
      type: 'regular',
      label: 'POTTER Harry'
    },
    {
      id: 2,
      name: 'Ronald',
      surname: 'Weasley',
      dataClass: 'person',
      type: 'regular',
      label: 'WEASLEY Ronald'
    },
    {
      id: 3,
      name: '',
      surname: '',
      nickname: 'Lord Voldemort',
      dataClass: 'person',
      type: 'regular',
      label: 'Lord Voldemort'
    },
    {
      id: 4,
      name: 'Tom Marvolo',
      surname: 'Riddle',
      dataClass: 'person',
      type: 'regular',
      label: 'RIDDLE Tom Mar...'
    },
    {
      id: 5,
      name: 'Bathilda',
      surname: 'Bagshot',
      dataClass: 'person',
      type: 'regular',
      label: 'BAGSHOT Bathilda'
    },
    {
      id: 6,
      name: 'Rubeus',
      surname: 'Hagrid',
      dataClass: 'person',
      type: 'regular',
      label: 'HAGRID Rubeus'
    },
    {
      id: 7,
      name: 'Albus',
      surname: 'Dumbledore',
      dataClass: 'person',
      type: 'regular',
      label: 'DUMBLEDORE Albus'
    },
    {
      id: 8,
      name: 'Ginny',
      surname: 'Weasley',
      dataClass: 'person',
      type: 'regular',
      label: 'WEASLEY Ginny'
    },
    {
      id: 9,
      name: 'Myrtle',
      surname: 'Warren',
      dataClass: 'person',
      type: 'regular',
      label: 'WARREN Myrtle'
    },
    {
      id: 10,
      name: 'Colin',
      surname: 'Creevey',
      dataClass: 'person',
      type: 'regular',
      label: 'CREEVEY Colin'
    },
    {
      id: 11,
      name: 'Penelope',
      surname: 'Clearwater',
      dataClass: 'person',
      type: 'regular',
      label: 'CLEARWATER Pen...'
    },
    {
      id: 12,
      name: 'Justin',
      surname: 'Fletchley',
      dataClass: 'person',
      type: 'regular',
      label: 'FLETCHLEY Justin'
    },
    {
      id: 13,
      name: 'Quirinus',
      surname: 'Quirrell',
      dataClass: 'person',
      type: 'regular',
      label: 'QUIRRELL Quirinus'
    },
    {
      id: 14,
      name: 'Mrs. Norris',
      dataClass: 'cat',
      type: 'regular',
      label: 'Mrs. Norris'
    },
    {
      id: 15,
      name: 'Nagini',
      dataClass: 'snake',
      type: 'regular',
      label: 'Nagini'
    },
    {
      id: 16,
      company_name: 'Gringotts W. Bank',
      ico: '451-895-12203',
      dataClass: 'company',
      type: 'regular',
      label: 'Gringotts W. Bank'
    },
    {
      id: 17,
      company_name: 'Hogwarts School of Wizardry',
      ico: '302-895-12203',
      dataClass: 'company',
      type: 'regular',
      label: 'Hogwarts School ...'
    },
    {
      id: 18,
      title: 'Basilisk accident',
      dataClass: 'document',
      type: 'regular',
      date: '01-09-1991',
      label: 'Basilisk accident'
    },
    {
      id: 19,
      title: "Attack at Godric's Hollow",
      dataClass: 'document',
      type: 'regular',
      date: '24-12-1997',
      label: "Attack at Godric's"
    },
    {
      id: 20,
      title: 'Flying car accident',
      dataClass: 'document',
      type: 'regular',
      date: '31-08-1992',
      label: 'Flying car accident'
    },
    {
      id: 21,
      title: 'Vault 713',
      dataClass: 'account',
      type: 'regular',
      label: 'Vault 713'
    },
    {
      id: 22,
      plate: '7990 TD',
      dataClass: 'car',
      type: 'regular',
      label: 'Car 7990 TD'
    },
    {
      id: 23,
      address: "Godric's Hollow",
      dataClass: 'location',
      type: 'regular',
      label: "Godric's Hollow, UK"
    },
    {
      id: 24,
      address: "King's Cross, London",
      dataClass: 'location',
      type: 'regular',
      label: "King's Cross, London"
    },
    {
      id: 25,
      address: 'Diagon Alley, London',
      dataClass: 'location',
      type: 'regular',
      label: 'Diagon Alley, London'
    },
    {
      id: 26,
      name: 'Leather Diary',
      dataClass: 'object',
      type: 'regular',
      label: 'Leather Diary'
    }
  ],
  links: [
    // Hermione
    {
      id: 0,
      source: 0,
      target: 2,
      direction: false,
      description: 'friend'
    },
    {
      id: 1,
      source: 0,
      target: 1,
      direction: false,
      description: 'friend'
    },
    {
      id: 2,
      source: 5,
      target: 0,
      direction: false,
      description: 'assaulted'
    },
    {
      id: 3,
      source: 5,
      target: 0,
      direction: false,
      description: 'assaulted'
    },
    {
      id: 4,
      source: 0,
      target: 19,
      direction: false,
      description: 'student'
    },
    {
      id: 5,
      source: 0,
      target: 19,
      direction: false,
      description: 'victim'
    },
    {
      id: 6,
      source: 0,
      target: 18,
      direction: false,
      description: 'victim'
    },
    // Harry
    {
      id: 7,
      source: 1,
      target: 2, // Ron
      direction: true,
      description: 'friends'
    },

    // multilink 8,9 -> 10
    {
      id: 8,
      source: 1,
      target: 8,
      direction: false,
      description: 'friend',
      vis: {
        inMultilink: 10
      }
    },
    {
      id: 9,
      source: 8,
      target: 1,
      direction: false,
      description: 'in relationship',
      vis: {
        inMultilink: 10
      }
    },
    {
      id: 10,
      source: 1,
      target: 8, // Ginny
      direction: {
        nonDirectional: true,
        sourceToTarget: false,
        targetToSource: false
      },
      vis: {
        isMultilink: true
      }
    },

    // multilink 11,12,13 -> 14
    {
      id: 11,
      source: 1,
      target: 6,
      direction: false,
      description: 'friend',
      vis: {
        inMultilink: 14
      }
    },
    {
      id: 12,
      source: 6,
      target: 1,
      direction: false,
      description: 'caretaker',
      vis: {
        inMultilink: 14
      }
    },
    {
      id: 13,
      source: 1,
      target: 6,
      direction: true,
      description: 'student',
      vis: {
        inMultilink: 14
      }
    },
    {
      id: 14,
      source: 1,
      target: 6, // Hagrid
      direction: {
        nonDirectional: true,
        sourceToTarget: true,
        targetToSource: false
      },
      vis: {
        isMultilink: true
      }
    },

    {
      id: 15,
      source: 5, // Batilda
      target: 1,
      direction: true,
      description: 'attempt to kill'
    },
    {
      id: 16,
      source: 4, // Tom Riddle
      target: 1,
      direction: true,
      description: 'attempt to kill'
    },
    {
      id: 17,
      source: 13, // Quirell
      target: 1,
      direction: true,
      description: 'attempt to kill'
    },
    {
      id: 18,
      source: 1,
      target: 17, // Howgarts
      direction: false,
      description: 'student'
    },
    {
      id: 19,
      source: 1,
      target: 21, // Vault 713
      direction: false,
      description: 'visited',
      time: '26-08-1991'
    },

    // multilink
    {
      id: 20,
      source: 1,
      target: 23,
      direction: false,
      description: 'lived in',
      vis: {
        inMultilink: 23
      }
    },
    {
      id: 21,
      source: 1,
      target: 23,
      direction: false,
      description: 'born in',
      vis: {
        inMultilink: 23
      }
    },
    {
      id: 22,
      source: 1,
      target: 23,
      direction: false,
      description: 'visited',
      vis: {
        inMultilink: 23
      }
    },
    {
      id: 23,
      source: 1,
      target: 23, // Godric's Hollow
      direction: {
        nonDirectional: true,
        sourceToTarget: false,
        targetToSource: false
      },
      vis: {
        isMultilink: true
      }
    },

    // multilink
    {
      id: 24,
      source: 1,
      target: 25,
      direction: false,
      description: 'visited',
      vis: {
        inMultilink: 24
      }
    },
    {
      id: 25,
      source: 1,
      target: 25,
      direction: false,
      description: 'visited',
      vis: {
        inMultilink: 24
      }
    },
    {
      id: 26,
      source: 1,
      target: 25,
      direction: false,
      description: 'visited',
      vis: {
        inMultilink: 24
      }
    },
    {
      id: 27,
      source: 1,
      target: 24, // Diagon Alley
      direction: {
        nonDirectional: true,
        sourceToTarget: true,
        targetToSource: false
      },
      vis: {
        isMultilink: true
      }
    },

    {
      id: 28,
      source: 1,
      target: 22, // car
      direction: false,
      description: 'usage'
    },
    {
      id: 29,
      source: 1,
      target: 20, // Flying car accident
      direction: false,
      description: 'accomplice'
    },
    {
      id: 30,
      source: 1,
      target: 18, // Basilisk accident
      direction: true,
      description: 'killed Basilisk'
    },
    {
      id: 31,
      source: 15, // Nagini
      target: 1,
      direction: true,
      description: 'attecked'
    },
    // RON
    {
      id: 32,
      source: 2,
      target: 20, // Flying car accident
      direction: false,
      description: 'culprit'
    },
    {
      id: 33,
      source: 2,
      target: 22, // car
      direction: false,
      description: 'usage'
    },
    {
      id: 34,
      source: 2,
      target: 17, // Howgarts
      direction: false,
      description: 'student'
    },
    {
      id: 35,
      source: 2,
      target: 8, // Ginny
      direction: false,
      description: 'sibblings'
    },
    // VOlDERMORt
    {
      id: 36,
      source: 3,
      target: 15, // Nagini
      direction: true,
      description: 'master'
    },
    // TOM Riddle
    {
      id: 37,
      source: 7, // Dumbledore
      target: 4,
      direction: true,
      description: 'caretaker'
    },
    {
      id: 38,
      source: 4,
      target: 18, // Basilisk accident
      direction: true,
      description: 'culprit'
    },
    {
      id: 39,
      source: 4,
      target: 26, // Leather Diary
      direction: true,
      description: 'owner'
    },
    {
      id: 40,
      source: 4,
      target: 17, // Howgarts
      direction: false,
      description: 'student'
    },
    // Bathilda
    {
      id: 41,
      source: 15, // Nagini
      target: 5,
      direction: true,
      description: 'disguised as'
    },
    {
      id: 42,
      source: 5,
      target: 19, // Attack at Godrics
      direction: false,
      description: 'victim'
    },
    {
      id: 43,
      source: 5,
      target: 23, // Godrics
      direction: false,
      description: 'lived in'
    },
    // Hagrid
    {
      id: 44,
      source: 6,
      target: 21, // Vault 713
      direction: false,
      description: 'visited'
    },

    // multilink
    {
      id: 45,
      source: 1,
      target: 25,
      direction: false,
      description: 'visited',
      vis: {
        inMultilink: 49
      }
    },
    {
      id: 46,
      source: 1,
      target: 25,
      direction: false,
      description: 'visited',
      vis: {
        inMultilink: 49
      }
    },
    {
      id: 47,
      source: 1,
      target: 25,
      direction: false,
      description: 'visited',
      vis: {
        inMultilink: 49
      }
    },
    {
      id: 48,
      source: 1,
      target: 25,
      direction: false,
      description: 'visited',
      vis: {
        inMultilink: 49
      }
    },
    {
      id: 49,
      source: 6,
      target: 25, // Diagon Alley
      direction: {
        nonDirectional: true,
        sourceToTarget: false,
        targetToSource: false
      },
      vis: {
        isMultilink: true
      }
    },

    {
      id: 50,
      source: 6,
      target: 13, // Quirrell
      direction: false,
      description: 'met in pub'
    },
    {
      id: 51,
      source: 6,
      target: 17, // Hogwarts
      direction: false,
      description: 'Keeper of keys and grounds'
    },
    // DUMBLEDORE
    {
      id: 52,
      source: 7,
      target: 17, // Hogwarts
      direction: false,
      description: 'Headmaster'
    },
    // GINNY
    {
      id: 53,
      source: 8,
      target: 17, // Hogwarts
      direction: false,
      description: 'student'
    },
    {
      id: 54,
      source: 8,
      target: 26, // Diary
      direction: true,
      description: 'usage'
    },
    {
      id: 56,
      source: 8,
      target: 18, // Basilisk accident
      direction: false,
      description: 'victim'
    },
    // BASILISK ACCIDENT
    {
      id: 57,
      source: 18,
      target: 9, // myrtle
      direction: false,
      description: 'victim'
    },
    {
      id: 58,
      source: 18,
      target: 10, // Colin
      direction: false,
      description: 'victim'
    },
    {
      id: 59,
      source: 18,
      target: 11, // Penelope
      direction: false,
      description: 'victim'
    },
    {
      id: 60,
      source: 18, // Basilisk accident
      target: 12, // justin
      direction: false,
      description: 'victim'
    },
    {
      id: 61,
      source: 18, // Basilisk accident
      target: 14, // Mrs Norris
      direction: false,
      description: 'victim'
    },
    {
      id: 62,
      source: 18,
      target: 17, // Hogwarts
      direction: false,
      description: 'crime scene'
    },
    {
      id: 63,
      source: 18,
      target: 26, // Diary
      direction: false,
      description: 'weapon'
    },
    // QUIRRELL
    {
      id: 64,
      source: 13,
      target: 17, // Hogwarts
      direction: false,
      description: 'teacher'
    },
    {
      id: 65,
      source: 13,
      target: 25, // Diagon Alley
      direction: false,
      description: 'visited'
    },
    // GRINGOTTS
    {
      id: 66,
      source: 16,
      target: 21, // Vault 713
      direction: false,
      description: 'owns'
    },
    {
      id: 67,
      source: 16,
      target: 25, // Diagon Alley
      direction: false,
      description: 'located'
    },
    // Godrics
    {
      id: 68,
      source: 19, // Attack at godrics
      target: 23, // Godrics
      direction: false,
      description: 'crime scene'
    },
    // car
    {
      id: 69,
      source: 22,
      target: 24, // Kings Cross
      direction: false,
      description: 'seen by muggles'
    },
    {
      id: 70,
      source: 22,
      target: 20, // Flying car accident
      direction: false,
      description: 'object of offense'
    },
    {
      id: 71,
      source: 24, // Kings cross
      target: 20, // Flying car accident
      direction: false,
      description: 'offense scene'
    }
  ]
}
