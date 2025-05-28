import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import path from 'path';

const prisma = new PrismaClient();

// Import all avatar images
const avatars = {
  avatar1: '/assets/icons/user1.svg',
  avatar2: '/assets/icons/user2.svg',
  avatar3: '/assets/icons/user3.svg',
  avatar4: '/assets/icons/user4.svg',
  avatar5: '/assets/icons/user5.svg',
  avatar6: '/assets/icons/user6.svg',
  avatar7: '/assets/icons/user7.svg',
  avatar8: '/assets/icons/user8.svg',
  avatar9: '/assets/icons/user9.svg',
};

async function main() {
  try {
    console.log('Starting database setup...');
    
    const saltRounds = 10;
    const password = await bcrypt.hash('password123', saltRounds); 
    
    const users = [
      {
        name: 'Alex Turner',
        username: 'alexturner',
        email: 'alex@example.com',
        password,
        bio: 'Software developer who loves hiking and photography',
        avatarUrl: avatars.avatar1
      },
      {
        name: 'Brooke Wells',
        username: 'brookewells',
        email: 'brooke@example.com',
        password,
        bio: 'Marketing specialist based in Chicago',
        avatarUrl: avatars.avatar2
      },
      {
        name: 'Carlos Rodriguez',
        username: 'crodriguez',
        email: 'carlos@example.com',
        password,
        bio: 'Coffee enthusiast and avid traveler',
        avatarUrl: avatars.avatar3
      },
      {
        name: 'Dana Kim',
        username: 'danakim',
        email: 'dana@example.com',
        password,
        bio: 'UX designer and art lover',
        avatarUrl: avatars.avatar4
      },
      {
        name: 'Ethan Nguyen',
        username: 'ethannguyen',
        email: 'ethan@example.com',
        password,
        bio: 'Financial analyst with a passion for cooking',
        avatarUrl: avatars.avatar5
      },
      {
        name: 'Fatima Hassan',
        username: 'fhassan',
        email: 'fatima@example.com',
        password,
        bio: 'Medical student and volunteer coordinator',
        avatarUrl: avatars.avatar6
      },
      {
        name: 'Gabriel Santos',
        username: 'gsantos',
        email: 'gabriel@example.com',
        password,
        bio: 'Music producer and yoga instructor',
        avatarUrl: avatars.avatar7
      },
      {
        name: 'Harper Wilson',
        username: 'hwilson',
        email: 'harper@example.com',
        password,
        bio: 'Environmental scientist and rock climber',
        avatarUrl: avatars.avatar8
      },
      {
        name: 'Imran Khan',
        username: 'ikhan',
        email: 'imran@example.com',
        password,
        bio: 'Data analyst who enjoys basketball and reading',
        avatarUrl: avatars.avatar9
      },
      {
        name: 'Julia Martinez',
        username: 'jmartinez',
        email: 'julia@example.com',
        password,
        bio: 'Freelance writer and dog lover',
        avatarUrl: avatars.avatar1
      },
      {
        name: 'Kenji Tanaka',
        username: 'ktanaka',
        email: 'kenji@example.com',
        password,
        bio: 'Architect and amateur chef',
        avatarUrl: avatars.avatar2
      },
      {
        name: 'Lena Okafor',
        username: 'lokafor',
        email: 'lena@example.com',
        password,
        bio: 'Startup founder and tech enthusiast',
        avatarUrl: avatars.avatar3
      },
      {
        name: 'Miguel Reyes',
        username: 'mreyes',
        email: 'miguel@example.com',
        password,
        bio: 'Physical therapist who loves surfing',
        avatarUrl: avatars.avatar4
      },
      {
        name: 'Nina Patel',
        username: 'npatel',
        email: 'nina@example.com',
        password,
        bio: 'Digital marketing manager and plant collector',
        avatarUrl: avatars.avatar5
      },
      {
        name: 'Omar Farooq',
        username: 'ofarooq',
        email: 'omar@example.com',
        password,
        bio: 'Mobile app developer and coffee connoisseur',
        avatarUrl: avatars.avatar6
      },
      {
        name: 'Priya Sharma',
        username: 'psharma',
        email: 'priya@example.com',
        password,
        bio: 'Graphic designer with a passion for photography',
        avatarUrl: avatars.avatar7
      }
    ];
    
    try {
      console.log('Setting up database schema...');
      
      console.log('Creating users...');
      for (const userData of users) {
        await prisma.user.create({
          data: userData
        });
      }
      
      // Set up friendships
      console.log('Setting up friendships...');

      try {
        // First clear any existing friendship connections for Alex
        const alex = await prisma.user.findUnique({ 
          where: { username: 'alexturner' },
          include: { friends: true }
        });
        
        if (!alex) {
          throw new Error('Alex Turner user not found');
        }
        
        console.log(`Found Alex with ID: ${alex.id}`);
        
        // Get all other users except Alex
        const allOtherUsers = await prisma.user.findMany({
          where: {
            username: {
              not: 'alexturner',
            },
          },
          take: 13,
        });
        
        console.log(`Found ${allOtherUsers.length} other users to connect with Alex`);
        
        // Create friendship connections
        for (const otherUser of allOtherUsers) {
          console.log(`Creating friendship between Alex and ${otherUser.username}`);
          
          await prisma.user.update({
            where: { id: alex.id },
            data: { friends: { connect: { id: otherUser.id } } },
          });
          
          await prisma.user.update({
            where: { id: otherUser.id },
            data: { friends: { connect: { id: alex.id } } },
          });
        }
        
        // Verify Alex's friends
        const alexWithFriends = await prisma.user.findUnique({
          where: { username: 'alexturner' },
          include: { friends: true }
        });
        
        console.log(`Alex now has ${alexWithFriends?.friends.length} friends`);
        
        // Remove the redundant friendship creation code below this section
        // or comment it out since it might cause conflicts
      } catch (error) {
        console.error('Error setting up Alex\'s friendships:', error);
      }

      // Create some friendship connections
      const user1 = await prisma.user.findUnique({ where: { username: 'alexturner' } });
      const user2 = await prisma.user.findUnique({ where: { username: 'brookewells' } });
      const user3 = await prisma.user.findUnique({ where: { username: 'crodriguez' } });
      const user4 = await prisma.user.findUnique({ where: { username: 'danakim' } });
      const user5 = await prisma.user.findUnique({ where: { username: 'ethannguyen' } });

      if (user1 && user2) {
        await prisma.user.update({
          where: { id: user1.id },
          data: { friends: { connect: { id: user2.id } } }
        });
        await prisma.user.update({
          where: { id: user2.id },
          data: { friends: { connect: { id: user1.id } } }
        });
      }

      if (user1 && user3) {
        await prisma.user.update({
          where: { id: user1.id },
          data: { friends: { connect: { id: user3.id } } }
        });
        await prisma.user.update({
          where: { id: user3.id },
          data: { friends: { connect: { id: user1.id } } }
        });
      }

      if (user2 && user4) {
        await prisma.user.update({
          where: { id: user2.id },
          data: { friends: { connect: { id: user4.id } } }
        });
        await prisma.user.update({
          where: { id: user4.id },
          data: { friends: { connect: { id: user2.id } } }
        });
      }

      if (user3 && user5) {
        await prisma.user.update({
          where: { id: user3.id },
          data: { friends: { connect: { id: user5.id } } }
        });
        await prisma.user.update({
          where: { id: user5.id },
          data: { friends: { connect: { id: user3.id } } }
        });
      }

      // Create 4 groups with members and items
      console.log('Creating groups with items and members...');

      // Find Alex user for reference
      const alex = await prisma.user.findUnique({ where: { username: 'alexturner' } });
      const brooke = await prisma.user.findUnique({ where: { username: 'brookewells' } });
      const carlos = await prisma.user.findUnique({ where: { username: 'crodriguez' } });
      const dana = await prisma.user.findUnique({ where: { username: 'danakim' } });
      const ethan = await prisma.user.findUnique({ where: { username: 'ethannguyen' } });
      const fatima = await prisma.user.findUnique({ where: { username: 'fhassan' } });
      const gabriel = await prisma.user.findUnique({ where: { username: 'gsantos' } });
      const harper = await prisma.user.findUnique({ where: { username: 'hwilson' } });
      const imran = await prisma.user.findUnique({ where: { username: 'ikhan' } });
      const julia = await prisma.user.findUnique({ where: { username: 'jmartinez' } });
      const kenji = await prisma.user.findUnique({ where: { username: 'ktanaka' } });
      const lena = await prisma.user.findUnique({ where: { username: 'lokafor' } });

      if (alex && brooke && carlos && dana && ethan && fatima && gabriel && harper && imran && julia) {
        // GROUP 1: Weekend Getaway - Alex as owner
        console.log('Creating Weekend Getaway group...');
        const weekendGroup = await prisma.group.create({
          data: {
            name: 'Weekend Getaway',
            description: 'Beach house trip expenses',
            icon: '/assets/icons/group1.svg',
            serviceCharge: 0,
            tax: 0,
            ownerId: alex.id,
            members: {
              create: [
                { userId: alex.id }, // Owner is automatically a member
                { userId: brooke.id },
                { userId: carlos.id },
                { userId: dana.id },
                { userId: ethan.id },
                { userId: fatima.id }
              ]
            }
          }
        });

        // GROUP 1 ITEMS
        console.log('Adding items to Weekend Getaway...');
        
        // Item 1: Beach House Rental
        const rental = await prisma.item.create({
          data: {
            name: 'Beach House Rental',
            amount: 1200.00,
            groupId: weekendGroup.id
          }
        });

        // Split rental equally among all 6 members
        const rentalShare = 1200.00 / 6;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: rental.id, userId: alex.id, amount: rentalShare } }),
          prisma.itemUser.create({ data: { itemId: rental.id, userId: brooke.id, amount: rentalShare } }),
          prisma.itemUser.create({ data: { itemId: rental.id, userId: carlos.id, amount: rentalShare } }),
          prisma.itemUser.create({ data: { itemId: rental.id, userId: dana.id, amount: rentalShare } }),
          prisma.itemUser.create({ data: { itemId: rental.id, userId: ethan.id, amount: rentalShare } }),
          prisma.itemUser.create({ data: { itemId: rental.id, userId: fatima.id, amount: rentalShare } })
        ]);

        // Item 2: Groceries
        const groceries = await prisma.item.create({
          data: {
            name: 'Groceries',
            amount: 320.45,
            groupId: weekendGroup.id
          }
        });

        // Split groceries equally
        const groceryShare = 320.45 / 6;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: groceries.id, userId: alex.id, amount: groceryShare } }),
          prisma.itemUser.create({ data: { itemId: groceries.id, userId: brooke.id, amount: groceryShare } }),
          prisma.itemUser.create({ data: { itemId: groceries.id, userId: carlos.id, amount: groceryShare } }),
          prisma.itemUser.create({ data: { itemId: groceries.id, userId: dana.id, amount: groceryShare } }),
          prisma.itemUser.create({ data: { itemId: groceries.id, userId: ethan.id, amount: groceryShare } }),
          prisma.itemUser.create({ data: { itemId: groceries.id, userId: fatima.id, amount: groceryShare } })
        ]);

        // Item 3: Boat Rental - Only 4 people participated
        const boat = await prisma.item.create({
          data: {
            name: 'Boat Rental',
            amount: 300.00,
            groupId: weekendGroup.id
          }
        });

        // Split boat only among 4 members
        const boatShare = 300.00 / 4;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: boat.id, userId: alex.id, amount: boatShare } }),
          prisma.itemUser.create({ data: { itemId: boat.id, userId: brooke.id, amount: boatShare } }),
          prisma.itemUser.create({ data: { itemId: boat.id, userId: carlos.id, amount: boatShare } }),
          prisma.itemUser.create({ data: { itemId: boat.id, userId: dana.id, amount: boatShare } })
        ]);

        // Item 4: Dinner at Restaurant
        const dinner = await prisma.item.create({
          data: {
            name: 'Seafood Dinner',
            amount: 425.80,
            groupId: weekendGroup.id
          }
        });

        // Split dinner equally
        const dinnerShare = 425.80 / 6;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: dinner.id, userId: alex.id, amount: dinnerShare } }),
          prisma.itemUser.create({ data: { itemId: dinner.id, userId: brooke.id, amount: dinnerShare } }),
          prisma.itemUser.create({ data: { itemId: dinner.id, userId: carlos.id, amount: dinnerShare } }),
          prisma.itemUser.create({ data: { itemId: dinner.id, userId: dana.id, amount: dinnerShare } }),
          prisma.itemUser.create({ data: { itemId: dinner.id, userId: ethan.id, amount: dinnerShare } }),
          prisma.itemUser.create({ data: { itemId: dinner.id, userId: fatima.id, amount: dinnerShare } })
        ]);

        // Item 5: Gas and Transportation
        const gas = await prisma.item.create({
          data: {
            name: 'Gas & Transportation',
            amount: 175.25,
            groupId: weekendGroup.id
          }
        });

        // Only 3 people drove and split gas
        const gasShare = 175.25 / 3;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: gas.id, userId: alex.id, amount: gasShare } }),
          prisma.itemUser.create({ data: { itemId: gas.id, userId: ethan.id, amount: gasShare } }),
          prisma.itemUser.create({ data: { itemId: gas.id, userId: carlos.id, amount: gasShare } })
        ]);

        // GROUP 2: Apartment 4B - Alex as owner
        console.log('Creating Apartment 4B group...');
        const apartmentGroup = await prisma.group.create({
          data: {
            name: 'Apartment 4B',
            description: 'Shared apartment expenses',
            icon: '/assets/icons/group2.svg',
            serviceCharge: 0,
            tax: 0,
            ownerId: alex.id,
            members: {
              create: [
                { userId: alex.id },
                { userId: gabriel.id },
                { userId: harper.id }
              ]
            }
          }
        });

        // GROUP 2 ITEMS
        console.log('Adding items to Apartment 4B...');
        
        // Item 1: Rent
        const rent = await prisma.item.create({
          data: {
            name: 'Monthly Rent',
            amount: 2400.00,
            groupId: apartmentGroup.id
          }
        });

        // Split rent equally
        const rentShare = 2400.00 / 3;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: rent.id, userId: alex.id, amount: rentShare } }),
          prisma.itemUser.create({ data: { itemId: rent.id, userId: gabriel.id, amount: rentShare } }),
          prisma.itemUser.create({ data: { itemId: rent.id, userId: harper.id, amount: rentShare } })
        ]);

        // Item 2: Utilities
        const utilities = await prisma.item.create({
          data: {
            name: 'Utilities',
            amount: 185.67,
            groupId: apartmentGroup.id
          }
        });

        // Split utilities equally
        const utilitiesShare = 185.67 / 3;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: utilities.id, userId: alex.id, amount: utilitiesShare } }),
          prisma.itemUser.create({ data: { itemId: utilities.id, userId: gabriel.id, amount: utilitiesShare } }),
          prisma.itemUser.create({ data: { itemId: utilities.id, userId: harper.id, amount: utilitiesShare } })
        ]);

        // Item 3: Internet
        const internet = await prisma.item.create({
          data: {
            name: 'Internet',
            amount: 89.99,
            groupId: apartmentGroup.id
          }
        });

        // Split internet equally
        const internetShare = 89.99 / 3;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: internet.id, userId: alex.id, amount: internetShare } }),
          prisma.itemUser.create({ data: { itemId: internet.id, userId: gabriel.id, amount: internetShare } }),
          prisma.itemUser.create({ data: { itemId: internet.id, userId: harper.id, amount: internetShare } })
        ]);

        // Item 4: Cleaning supplies
        const cleaning = await prisma.item.create({
          data: {
            name: 'Cleaning Supplies',
            amount: 45.32,
            groupId: apartmentGroup.id
          }
        });

        // Split cleaning equally
        const cleaningShare = 45.32 / 3;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: cleaning.id, userId: alex.id, amount: cleaningShare } }),
          prisma.itemUser.create({ data: { itemId: cleaning.id, userId: gabriel.id, amount: cleaningShare } }),
          prisma.itemUser.create({ data: { itemId: cleaning.id, userId: harper.id, amount: cleaningShare } })
        ]);

        // Item 5: Groceries
        const apartmentGroceries = await prisma.item.create({
          data: {
            name: 'Shared Groceries',
            amount: 132.78,
            groupId: apartmentGroup.id
          }
        });

        // Split groceries equally
        const apartmentGroceryShare = 132.78 / 3;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: apartmentGroceries.id, userId: alex.id, amount: apartmentGroceryShare } }),
          prisma.itemUser.create({ data: { itemId: apartmentGroceries.id, userId: gabriel.id, amount: apartmentGroceryShare } }),
          prisma.itemUser.create({ data: { itemId: apartmentGroceries.id, userId: harper.id, amount: apartmentGroceryShare } })
        ]);

        // GROUP 3: Office Lunch Club - Brooke as owner
        console.log('Creating Office Lunch Club group...');
        const lunchGroup = await prisma.group.create({
          data: {
            name: 'Office Lunch Club',
            description: 'Team lunch expenses',
            icon: '/assets/icons/group3.svg',
            serviceCharge: 15, // 15% service charge for restaurants
            tax: 10, // 10% tax
            ownerId: brooke.id,
            members: {
              create: [
                { userId: brooke.id }, // Owner
                { userId: alex.id },
                { userId: imran.id },
                { userId: julia.id },
                { userId: dana.id }
              ]
            }
          }
        });

        // GROUP 3 ITEMS
        console.log('Adding items to Office Lunch Club...');
        
        // Item 1: Monday Sushi
        const sushi = await prisma.item.create({
          data: {
            name: 'Monday Sushi',
            amount: 187.50,
            groupId: lunchGroup.id
          }
        });

        // Only 5 people attended Monday lunch
        const sushiShare = 187.50 / 5;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: sushi.id, userId: brooke.id, amount: sushiShare } }),
          prisma.itemUser.create({ data: { itemId: sushi.id, userId: alex.id, amount: sushiShare } }),
          prisma.itemUser.create({ data: { itemId: sushi.id, userId: imran.id, amount: sushiShare } }),
          prisma.itemUser.create({ data: { itemId: sushi.id, userId: julia.id, amount: sushiShare } }),
          prisma.itemUser.create({ data: { itemId: sushi.id, userId: dana.id, amount: sushiShare } })
        ]);

        // Item 2: Wednesday Tacos
        const tacos = await prisma.item.create({
          data: {
            name: 'Wednesday Tacos',
            amount: 142.75,
            groupId: lunchGroup.id
          }
        });

        // All 7 attended Wednesday lunch
        const tacosShare = 142.75 / 7;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: tacos.id, userId: brooke.id, amount: tacosShare } }),
          prisma.itemUser.create({ data: { itemId: tacos.id, userId: alex.id, amount: tacosShare } }),
          prisma.itemUser.create({ data: { itemId: tacos.id, userId: imran.id, amount: tacosShare } }),
          prisma.itemUser.create({ data: { itemId: tacos.id, userId: julia.id, amount: tacosShare } }),
          prisma.itemUser.create({ data: { itemId: tacos.id, userId: dana.id, amount: tacosShare } })
        ]);

        // Item 3: Friday Pizza
        const pizza = await prisma.item.create({
          data: {
            name: 'Friday Pizza',
            amount: 96.30,
            groupId: lunchGroup.id
          }
        });

        // 6 people attended Friday lunch
        const pizzaShare = 96.30 / 6;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: pizza.id, userId: brooke.id, amount: pizzaShare } }),
          prisma.itemUser.create({ data: { itemId: pizza.id, userId: alex.id, amount: pizzaShare } }),
          prisma.itemUser.create({ data: { itemId: pizza.id, userId: imran.id, amount: pizzaShare } }),
          prisma.itemUser.create({ data: { itemId: pizza.id, userId: dana.id, amount: pizzaShare } })
        ]);

        // Item 4: Coffee Run
        const coffee = await prisma.item.create({
          data: {
            name: 'Coffee Run',
            amount: 43.25,
            groupId: lunchGroup.id
          }
        });

        // Only 4 people ordered coffee
        const coffeeShare = 43.25 / 4;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: coffee.id, userId: brooke.id, amount: coffeeShare } }),
          prisma.itemUser.create({ data: { itemId: coffee.id, userId: julia.id, amount: coffeeShare } }),
          prisma.itemUser.create({ data: { itemId: coffee.id, userId: dana.id, amount: coffeeShare } })
        ]);

        // Item 5: Team Celebration Lunch
        const celebration = await prisma.item.create({
          data: {
            name: 'Team Celebration',
            amount: 325.90,
            groupId: lunchGroup.id
          }
        });

        // All 7 attended celebration lunch
        const celebrationShare = 325.90 / 7;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: celebration.id, userId: brooke.id, amount: celebrationShare } }),
          prisma.itemUser.create({ data: { itemId: celebration.id, userId: alex.id, amount: celebrationShare } }),
          prisma.itemUser.create({ data: { itemId: celebration.id, userId: imran.id, amount: celebrationShare } }),
          prisma.itemUser.create({ data: { itemId: celebration.id, userId: julia.id, amount: celebrationShare } }),
          prisma.itemUser.create({ data: { itemId: celebration.id, userId: dana.id, amount: celebrationShare } })
        ]);

        // GROUP 4: Fantasy Football League - Carlos as owner
        console.log('Creating Fantasy Football League group...');
        const footballGroup = await prisma.group.create({
          data: {
            name: 'Fantasy Football',
            description: 'League dues and expenses',
            icon: '/assets/icons/group4.svg',
            serviceCharge: 0,
            tax: 0,
            ownerId: carlos.id,
            members: {
              create: [
                { userId: carlos.id }, // Owner
                { userId: alex.id },
                { userId: ethan.id },
                { userId: gabriel.id },
                { userId: imran.id },
                { userId: harper.id },
                { userId: fatima.id }
              ]
            }
          }
        });

        // GROUP 4 ITEMS
        console.log('Adding items to Fantasy Football League...');
        
        // Item 1: League Entry Fee
        const entryFee = await prisma.item.create({
          data: {
            name: 'League Entry Fee',
            amount: 800.00, // $100 per person
            groupId: footballGroup.id
          }
        });

        // Everyone pays the same entry fee
        const entryShare = 100.00; // $100 each
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: entryFee.id, userId: carlos.id, amount: entryShare } }),
          prisma.itemUser.create({ data: { itemId: entryFee.id, userId: alex.id, amount: entryShare } }),
          prisma.itemUser.create({ data: { itemId: entryFee.id, userId: ethan.id, amount: entryShare } }),
          prisma.itemUser.create({ data: { itemId: entryFee.id, userId: gabriel.id, amount: entryShare } }),
          prisma.itemUser.create({ data: { itemId: entryFee.id, userId: imran.id, amount: entryShare } }),
          prisma.itemUser.create({ data: { itemId: entryFee.id, userId: harper.id, amount: entryShare } }),
          prisma.itemUser.create({ data: { itemId: entryFee.id, userId: fatima.id, amount: entryShare } })
        ]);

        // Item 2: Draft Party Food
        const draftParty = await prisma.item.create({
          data: {
            name: 'Draft Party Food',
            amount: 224.35,
            groupId: footballGroup.id
          }
        });

        // Everyone attended draft party
        const draftShare = 224.35 / 8;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: draftParty.id, userId: carlos.id, amount: draftShare } }),
          prisma.itemUser.create({ data: { itemId: draftParty.id, userId: alex.id, amount: draftShare } }),
          prisma.itemUser.create({ data: { itemId: draftParty.id, userId: ethan.id, amount: draftShare } }),
          prisma.itemUser.create({ data: { itemId: draftParty.id, userId: gabriel.id, amount: draftShare } }),
          prisma.itemUser.create({ data: { itemId: draftParty.id, userId: imran.id, amount: draftShare } }),
          prisma.itemUser.create({ data: { itemId: draftParty.id, userId: harper.id, amount: draftShare } }),
          prisma.itemUser.create({ data: { itemId: draftParty.id, userId: fatima.id, amount: draftShare } })
        ]);

        // Item 3: Trophy
        const trophy = await prisma.item.create({
          data: {
            name: 'League Trophy',
            amount: 79.99,
            groupId: footballGroup.id
          }
        });

        // Everyone contributes to trophy
        const trophyShare = 79.99 / 8;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: trophy.id, userId: carlos.id, amount: trophyShare } }),
          prisma.itemUser.create({ data: { itemId: trophy.id, userId: alex.id, amount: trophyShare } }),
          prisma.itemUser.create({ data: { itemId: trophy.id, userId: ethan.id, amount: trophyShare } }),
          prisma.itemUser.create({ data: { itemId: trophy.id, userId: gabriel.id, amount: trophyShare } }),
          prisma.itemUser.create({ data: { itemId: trophy.id, userId: imran.id, amount: trophyShare } }),
          prisma.itemUser.create({ data: { itemId: trophy.id, userId: harper.id, amount: trophyShare } }),
          prisma.itemUser.create({ data: { itemId: trophy.id, userId: fatima.id, amount: trophyShare } })
        ]);

        // Item 4: League Management Fee
        const leagueFee = await prisma.item.create({
          data: {
            name: 'League Management Site Fee',
            amount: 89.99,
            groupId: footballGroup.id
          }
        });

        // Everyone contributes to league fee
        const leagueFeeShare = 89.99 / 8;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: leagueFee.id, userId: carlos.id, amount: leagueFeeShare } }),
          prisma.itemUser.create({ data: { itemId: leagueFee.id, userId: alex.id, amount: leagueFeeShare } }),
          prisma.itemUser.create({ data: { itemId: leagueFee.id, userId: ethan.id, amount: leagueFeeShare } }),
          prisma.itemUser.create({ data: { itemId: leagueFee.id, userId: gabriel.id, amount: leagueFeeShare } }),
          prisma.itemUser.create({ data: { itemId: leagueFee.id, userId: imran.id, amount: leagueFeeShare } }),
          prisma.itemUser.create({ data: { itemId: leagueFee.id, userId: harper.id, amount: leagueFeeShare } }),
          prisma.itemUser.create({ data: { itemId: leagueFee.id, userId: fatima.id, amount: leagueFeeShare } })
        ]);

        // Item 5: Mid-season Party
        const midSeason = await prisma.item.create({
          data: {
            name: 'Mid-season Watch Party',
            amount: 156.28,
            groupId: footballGroup.id
          }
        });

        // Only 6 people attended mid-season party
        const midSeasonShare = 156.28 / 6;
        await Promise.all([
          prisma.itemUser.create({ data: { itemId: midSeason.id, userId: carlos.id, amount: midSeasonShare } }),
          prisma.itemUser.create({ data: { itemId: midSeason.id, userId: alex.id, amount: midSeasonShare } }),
          prisma.itemUser.create({ data: { itemId: midSeason.id, userId: ethan.id, amount: midSeasonShare } }),
          prisma.itemUser.create({ data: { itemId: midSeason.id, userId: imran.id, amount: midSeasonShare } }),
          prisma.itemUser.create({ data: { itemId: midSeason.id, userId: harper.id, amount: midSeasonShare } })
        ]);

        console.log('Finished creating groups with items and members');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();