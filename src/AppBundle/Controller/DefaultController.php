<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Choice;
use AppBundle\Form\NumberChoiceType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     * @Template("default/index.html.twig")
     */
    public function indexAction(Request $request)
    {
        $choice = new Choice();
        $form = $this->createForm(NumberChoiceType::class, $choice)
                     ->add('submit', SubmitType::class, array('label' => 'Submit'));

        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($choice);
            $em->flush();

            return $this->redirectToRoute('homepage');
        }

        // replace this example code with whatever you need
        return array(
            'form' => $form->createView(),
        );
    }
}
