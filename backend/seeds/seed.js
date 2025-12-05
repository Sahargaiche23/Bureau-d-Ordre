const { sequelize, User, Service } = require('../models');
require('dotenv').config();

const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    
    await sequelize.sync({ force: true });
    console.log('Tables created...');

    // Create Services
    const services = await Service.bulkCreate([
      { name: 'Service des Affaires Générales', code: 'SAG', description: 'Gestion des affaires administratives générales', keywords: 'général,administratif,demande,attestation' },
      { name: 'Service Technique', code: 'ST', description: 'Affaires techniques et infrastructure', keywords: 'technique,construction,permis,infrastructure,travaux' },
      { name: 'Service Social', code: 'SS', description: 'Affaires sociales et aide aux citoyens', keywords: 'social,aide,assistance,famille,handicap' },
      { name: 'Service Économique', code: 'SE', description: 'Développement économique et commerce', keywords: 'économie,commerce,entreprise,investissement' },
      { name: 'Service Environnement', code: 'ENV', description: 'Protection de l\'environnement', keywords: 'environnement,pollution,déchet,vert' }
    ]);
    console.log('Services created');

    // Create Users
    const admin = await User.create({
      email: 'admin@gouvernorat-monastir.tn',
      password: 'admin123',
      firstName: 'Administrateur',
      lastName: 'Système',
      role: 'admin',
      phone: '73500000'
    });

    const agentBo = await User.create({
      email: 'agent@gouvernorat-monastir.tn',
      password: 'agent123',
      firstName: 'Ahmed',
      lastName: 'Ben Ali',
      role: 'agent_bo',
      phone: '73500001'
    });

    const chefService = await User.create({
      email: 'chef@gouvernorat-monastir.tn',
      password: 'chef123',
      firstName: 'Mohamed',
      lastName: 'Trabelsi',
      role: 'chef_service',
      serviceId: services[0].id,
      phone: '73500002'
    });

    const citoyen = await User.create({
      email: 'citoyen@example.com',
      password: 'citoyen123',
      firstName: 'Fatma',
      lastName: 'Khelifi',
      role: 'citoyen',
      cin: '12345678',
      phone: '98000000'
    });

    // Create Secrétaire Général
    const secretaireGeneral = await User.create({
      email: 'sg@gouvernorat-monastir.tn',
      password: 'sg123',
      firstName: 'Ali',
      lastName: 'Gharbi',
      role: 'secretaire_general',
      phone: '73500010'
    });

    // Create more chefs for other services
    const chefTechnique = await User.create({
      email: 'chef.technique@gouvernorat-monastir.tn',
      password: 'chef123',
      firstName: 'Karim',
      lastName: 'Mansour',
      role: 'chef_service',
      serviceId: services[1].id,
      phone: '73500003'
    });

    const chefSocial = await User.create({
      email: 'chef.social@gouvernorat-monastir.tn',
      password: 'chef123',
      firstName: 'Leila',
      lastName: 'Ben Salah',
      role: 'chef_service',
      serviceId: services[2].id,
      phone: '73500004'
    });

    const chefEconomique = await User.create({
      email: 'chef.economique@gouvernorat-monastir.tn',
      password: 'chef123',
      firstName: 'Sami',
      lastName: 'Bouazizi',
      role: 'chef_service',
      serviceId: services[3].id,
      phone: '73500005'
    });

    const chefEnvironnement = await User.create({
      email: 'chef.environnement@gouvernorat-monastir.tn',
      password: 'chef123',
      firstName: 'Nadia',
      lastName: 'Hamdi',
      role: 'chef_service',
      serviceId: services[4].id,
      phone: '73500006'
    });

    // Update service chefs
    await services[0].update({ chefId: chefService.id });
    await services[1].update({ chefId: chefTechnique.id });
    await services[2].update({ chefId: chefSocial.id });
    await services[3].update({ chefId: chefEconomique.id });
    await services[4].update({ chefId: chefEnvironnement.id });

    console.log('Users created');
    console.log('\\n=== Test Credentials ===');
    console.log('Admin: admin@gouvernorat-monastir.tn / admin123');
    console.log('Agent BO: agent@gouvernorat-monastir.tn / agent123');
    console.log('Secrétaire Général: sg@gouvernorat-monastir.tn / sg123');
    console.log('--- Chefs de Service ---');
    console.log('Chef SAG: chef@gouvernorat-monastir.tn / chef123');
    console.log('Chef Technique: chef.technique@gouvernorat-monastir.tn / chef123');
    console.log('Chef Social: chef.social@gouvernorat-monastir.tn / chef123');
    console.log('Chef Économique: chef.economique@gouvernorat-monastir.tn / chef123');
    console.log('Chef Environnement: chef.environnement@gouvernorat-monastir.tn / chef123');
    console.log('------------------------');
    console.log('Citoyen: citoyen@example.com / citoyen123');
    console.log('========================\\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
